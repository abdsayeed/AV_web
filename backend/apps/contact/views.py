"""
Views for Contact app.
"""
from rest_framework import status, permissions, generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.db.models import Q, Count, Avg
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import ContactSubmission, SubmissionNote, SubmissionAttachment, ContactFormAnalytics
from .serializers import (
    ContactSubmissionCreateSerializer,
    ContactSubmissionListSerializer,
    ContactSubmissionDetailSerializer,
    SubmissionNoteSerializer,
    SubmissionAttachmentSerializer,
    ContactFormAnalyticsSerializer,
    SubmissionStatusUpdateSerializer
)
from .filters import ContactSubmissionFilter
from .utils import send_submission_emails


class ContactSubmissionCreateView(APIView):
    """
    Create a new contact form submission.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Submit contact form."""
        serializer = ContactSubmissionCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            with transaction.atomic():
                submission = serializer.save()
                
                # Send emails asynchronously
                send_submission_emails(submission.id)
                
                # Log user activity if user is authenticated
                if request.user.is_authenticated:
                    from apps.users.utils import log_user_activity
                    log_user_activity(
                        user=request.user,
                        action='form_submit',
                        description=f'Contact form submitted: {submission.reference_number}',
                        request=request,
                        metadata={
                            'reference_number': submission.reference_number,
                            'business_name': submission.business_name
                        }
                    )
                
                return Response({
                    'success': True,
                    'message': 'Your inquiry has been received successfully!',
                    'referenceNumber': submission.reference_number,
                    'data': {
                        'id': submission.id,
                        'reference_number': submission.reference_number,
                        'business_name': submission.business_name,
                        'estimated_response_time': '24 hours'
                    }
                }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Please check your form data and try again.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ContactSubmissionListView(generics.ListAPIView):
    """
    List contact submissions (admin only).
    """
    queryset = ContactSubmission.objects.all().select_related('assigned_to').prefetch_related('notes')
    serializer_class = ContactSubmissionListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ContactSubmissionFilter
    search_fields = ['business_name', 'contact_name', 'email', 'reference_number']
    ordering_fields = ['created_at', 'updated_at', 'priority', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Only allow admin users to view submissions."""
        if not self.request.user.is_admin_user:
            return ContactSubmission.objects.none()
        return super().get_queryset()


class ContactSubmissionDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update contact submission details (admin only).
    """
    queryset = ContactSubmission.objects.all().select_related('assigned_to')
    serializer_class = ContactSubmissionDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Only allow admin users to view submissions."""
        if not self.request.user.is_admin_user:
            return ContactSubmission.objects.none()
        return super().get_queryset()

    def get_serializer_class(self):
        """Use different serializer for updates."""
        if self.request.method in ['PUT', 'PATCH']:
            return SubmissionStatusUpdateSerializer
        return ContactSubmissionDetailSerializer


class SubmissionNotesView(generics.ListCreateAPIView):
    """
    List and create notes for a submission (admin only).
    """
    serializer_class = SubmissionNoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get notes for specific submission."""
        if not self.request.user.is_admin_user:
            return SubmissionNote.objects.none()
        
        submission_id = self.kwargs.get('submission_id')
        return SubmissionNote.objects.filter(
            submission_id=submission_id
        ).select_related('author').order_by('-created_at')

    def perform_create(self, serializer):
        """Set submission from URL parameter."""
        submission_id = self.kwargs.get('submission_id')
        serializer.save(submission_id=submission_id)


class SubmissionAttachmentsView(generics.ListCreateAPIView):
    """
    List and create attachments for a submission (admin only).
    """
    serializer_class = SubmissionAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get attachments for specific submission."""
        if not self.request.user.is_admin_user:
            return SubmissionAttachment.objects.none()
        
        submission_id = self.kwargs.get('submission_id')
        return SubmissionAttachment.objects.filter(
            submission_id=submission_id
        ).select_related('uploaded_by').order_by('-created_at')

    def perform_create(self, serializer):
        """Set submission from URL parameter."""
        submission_id = self.kwargs.get('submission_id')
        serializer.save(submission_id=submission_id)


class ContactFormAnalyticsView(generics.CreateAPIView):
    """
    Track contact form analytics events.
    """
    serializer_class = ContactFormAnalyticsSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        """Create analytics event."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True}, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def submission_stats(request):
    """
    Get submission statistics (admin only).
    """
    if not request.user.is_admin_user:
        return Response({
            'success': False,
            'message': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    from datetime import timedelta
    
    now = timezone.now()
    last_30_days = now - timedelta(days=30)
    last_7_days = now - timedelta(days=7)
    
    # Basic counts
    total_submissions = ContactSubmission.objects.count()
    new_submissions = ContactSubmission.objects.filter(status='new').count()
    in_progress = ContactSubmission.objects.filter(status='in_progress').count()
    completed = ContactSubmission.objects.filter(status='completed').count()
    
    # Recent submissions
    recent_30_days = ContactSubmission.objects.filter(created_at__gte=last_30_days).count()
    recent_7_days = ContactSubmission.objects.filter(created_at__gte=last_7_days).count()
    
    # Overdue submissions
    overdue_submissions = ContactSubmission.objects.filter(
        status='new',
        created_at__lt=now - timedelta(hours=24)
    ).count()
    
    # Average response time (for completed submissions)
    avg_response_time = ContactSubmission.objects.filter(
        first_response_at__isnull=False
    ).aggregate(
        avg_hours=Avg('first_response_at') - Avg('created_at')
    )
    
    # Submissions by source
    by_source = dict(
        ContactSubmission.objects.values('source')
        .annotate(count=Count('source'))
        .values_list('source', 'count')
    )
    
    # Submissions by budget range
    by_budget = dict(
        ContactSubmission.objects.values('budget_range')
        .annotate(count=Count('budget_range'))
        .values_list('budget_range', 'count')
    )
    
    # Estimated total value
    estimated_value = sum(
        submission.estimated_value 
        for submission in ContactSubmission.objects.all()
    )
    
    # Recent submissions for dashboard
    recent_submissions = ContactSubmissionListSerializer(
        ContactSubmission.objects.select_related('assigned_to')
        .order_by('-created_at')[:10],
        many=True
    ).data
    
    stats = {
        'overview': {
            'total_submissions': total_submissions,
            'new_submissions': new_submissions,
            'in_progress': in_progress,
            'completed': completed,
            'overdue_submissions': overdue_submissions,
            'recent_30_days': recent_30_days,
            'recent_7_days': recent_7_days,
            'estimated_total_value': estimated_value,
        },
        'breakdown': {
            'by_source': by_source,
            'by_budget': by_budget,
        },
        'performance': {
            'average_response_time_hours': avg_response_time.get('avg_hours'),
            'completion_rate': (completed / total_submissions * 100) if total_submissions > 0 else 0,
        },
        'recent_submissions': recent_submissions,
    }
    
    return Response({
        'success': True,
        'stats': stats
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_update_submissions(request):
    """
    Bulk update multiple submissions (admin only).
    """
    if not request.user.is_admin_user:
        return Response({
            'success': False,
            'message': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    submission_ids = request.data.get('submission_ids', [])
    action = request.data.get('action')
    value = request.data.get('value')
    
    if not submission_ids or not action:
        return Response({
            'success': False,
            'message': 'submission_ids and action are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    submissions = ContactSubmission.objects.filter(id__in=submission_ids)
    
    if action == 'update_status':
        submissions.update(status=value, updated_at=timezone.now())
        message = f'Updated status to {value} for {submissions.count()} submissions'
    
    elif action == 'assign_to':
        submissions.update(assigned_to_id=value, updated_at=timezone.now())
        message = f'Assigned {submissions.count()} submissions to user'
    
    elif action == 'update_priority':
        submissions.update(priority=value, updated_at=timezone.now())
        message = f'Updated priority to {value} for {submissions.count()} submissions'
    
    else:
        return Response({
            'success': False,
            'message': 'Invalid action'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'success': True,
        'message': message
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def submission_lookup(request):
    """
    Look up submission by reference number (public endpoint).
    """
    reference_number = request.query_params.get('reference')
    email = request.query_params.get('email')
    
    if not reference_number or not email:
        return Response({
            'success': False,
            'message': 'Reference number and email are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        submission = ContactSubmission.objects.get(
            reference_number=reference_number,
            email__iexact=email
        )
        
        # Return limited public information
        data = {
            'reference_number': submission.reference_number,
            'business_name': submission.business_name,
            'status': submission.get_status_display(),
            'created_at': submission.created_at,
            'estimated_response_time': '24 hours',
            'contact_email': 'hello@ariesventures.co.uk'
        }
        
        return Response({
            'success': True,
            'submission': data
        })
    
    except ContactSubmission.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Submission not found with the provided reference number and email'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_assignments(request):
    """
    Get submissions assigned to the current user.
    """
    submissions = ContactSubmission.objects.filter(
        assigned_to=request.user
    ).select_related('assigned_to').prefetch_related('notes')
    
    # Apply filters
    status_filter = request.query_params.get('status')
    if status_filter:
        submissions = submissions.filter(status=status_filter)
    
    priority_filter = request.query_params.get('priority')
    if priority_filter:
        submissions = submissions.filter(priority=priority_filter)
    
    serializer = ContactSubmissionListSerializer(submissions, many=True)
    
    return Response({
        'success': True,
        'submissions': serializer.data,
        'count': submissions.count()
    })