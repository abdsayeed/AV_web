"""
Serializers for Contact app.
"""
from rest_framework import serializers
from django.utils import timezone
from .models import ContactSubmission, SubmissionNote, SubmissionAttachment, ContactFormAnalytics


class ContactSubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for contact form submissions.
    """
    reference_number = serializers.CharField(read_only=True)
    estimated_value = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    response_time = serializers.ReadOnlyField()

    class Meta:
        model = ContactSubmission
        fields = [
            'id', 'reference_number', 'source', 'referrer', 'template_id',
            'service_id', 'primary_goal', 'business_name', 'industry',
            'current_website', 'website_type', 'services_needed',
            'budget_range', 'timeline', 'target_date', 'additional_requirements',
            'contact_name', 'email', 'phone', 'preferred_contact',
            'best_time_to_reach', 'status', 'priority', 'assigned_to',
            'created_at', 'updated_at', 'estimated_value', 'is_overdue',
            'response_time', 'follow_up_count', 'last_contact_at'
        ]
        read_only_fields = [
            'id', 'reference_number', 'created_at', 'updated_at',
            'estimated_value', 'is_overdue', 'response_time'
        ]

    def validate_email(self, value):
        """Validate email format."""
        return value.lower()

    def validate_target_date(self, value):
        """Validate target date is in the future."""
        if value and value <= timezone.now().date():
            raise serializers.ValidationError("Target date must be in the future.")
        return value

    def validate(self, attrs):
        """Validate form data consistency."""
        # If timeline is specific, target_date is required
        if attrs.get('timeline') == 'specific' and not attrs.get('target_date'):
            raise serializers.ValidationError({
                'target_date': 'Target date is required when timeline is specific.'
            })
        
        # If timeline is not specific, clear target_date
        if attrs.get('timeline') != 'specific':
            attrs['target_date'] = None
        
        return attrs

    def create(self, validated_data):
        """Create a new contact submission."""
        # Generate reference number
        submission = ContactSubmission(**validated_data)
        submission.reference_number = submission.generate_reference_number()
        
        # Ensure reference number is unique
        while ContactSubmission.objects.filter(
            reference_number=submission.reference_number
        ).exists():
            submission.reference_number = submission.generate_reference_number()
        
        submission.save()
        return submission


class ContactSubmissionCreateSerializer(serializers.Serializer):
    """
    Serializer for creating contact submissions from frontend form data.
    """
    # Context data
    context = serializers.DictField()
    
    # Business information
    businessInfo = serializers.DictField()
    
    # Project requirements
    projectRequirements = serializers.DictField()
    
    # Contact information
    contactInfo = serializers.DictField()

    def validate_context(self, value):
        """Validate context data structure."""
        required_fields = ['source', 'primaryGoal']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Missing required field: {field}")
        return value

    def validate_businessInfo(self, value):
        """Validate business info structure."""
        required_fields = ['name', 'industry', 'websiteType']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Missing required field: {field}")
        return value

    def validate_projectRequirements(self, value):
        """Validate project requirements structure."""
        required_fields = ['servicesNeeded', 'budgetRange', 'timeline']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Missing required field: {field}")
        return value

    def validate_contactInfo(self, value):
        """Validate contact info structure."""
        required_fields = ['name', 'email']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Missing required field: {field}")
        
        # Validate email format
        email = value.get('email', '')
        if not '@' in email:
            raise serializers.ValidationError("Invalid email format")
        
        return value

    def create(self, validated_data):
        """Transform frontend data to backend model format."""
        context = validated_data['context']
        business_info = validated_data['businessInfo']
        project_req = validated_data['projectRequirements']
        contact_info = validated_data['contactInfo']
        
        # Map frontend field names to backend model fields
        submission_data = {
            # Context
            'source': context.get('source', 'direct'),
            'referrer': context.get('referrer'),
            'template_id': context.get('templateId'),
            'service_id': context.get('serviceId'),
            'primary_goal': context['primaryGoal'],
            
            # Business info
            'business_name': business_info['name'],
            'industry': business_info['industry'],
            'current_website': business_info.get('currentWebsite'),
            'website_type': business_info['websiteType'],
            
            # Project requirements
            'services_needed': project_req['servicesNeeded'],
            'budget_range': project_req['budgetRange'],
            'timeline': project_req['timeline'],
            'target_date': project_req.get('targetDate'),
            'additional_requirements': project_req.get('additionalRequirements'),
            
            # Contact info
            'contact_name': contact_info['name'],
            'email': contact_info['email'].lower(),
            'phone': contact_info.get('phone'),
            'preferred_contact': contact_info.get('preferredContact', 'email'),
            'best_time_to_reach': contact_info.get('bestTimeToReach', 'anytime'),
            
            # Store original form data
            'form_data': validated_data,
        }
        
        # Add request metadata if available
        request = self.context.get('request')
        if request:
            from apps.users.utils import get_client_ip, get_user_agent
            submission_data.update({
                'ip_address': get_client_ip(request),
                'user_agent': get_user_agent(request),
            })
        
        # Create submission using the main serializer
        serializer = ContactSubmissionSerializer(data=submission_data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()


class ContactSubmissionListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing contact submissions (admin view).
    """
    assigned_to_name = serializers.CharField(source='assigned_to.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    estimated_value = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    notes_count = serializers.IntegerField(source='notes.count', read_only=True)

    class Meta:
        model = ContactSubmission
        fields = [
            'id', 'reference_number', 'business_name', 'contact_name',
            'email', 'status', 'status_display', 'priority', 'priority_display',
            'assigned_to', 'assigned_to_name', 'created_at', 'updated_at',
            'estimated_value', 'is_overdue', 'notes_count', 'follow_up_count'
        ]


class ContactSubmissionDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for contact submissions (admin view).
    """
    assigned_to_name = serializers.CharField(source='assigned_to.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    estimated_value = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    response_time = serializers.ReadOnlyField()

    class Meta:
        model = ContactSubmission
        fields = '__all__'


class SubmissionNoteSerializer(serializers.ModelSerializer):
    """
    Serializer for submission notes.
    """
    author_name = serializers.CharField(source='author.name', read_only=True)
    note_type_display = serializers.CharField(source='get_note_type_display', read_only=True)

    class Meta:
        model = SubmissionNote
        fields = [
            'id', 'submission', 'author', 'author_name', 'note_type',
            'note_type_display', 'title', 'content', 'is_private',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Set author from request user."""
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class SubmissionAttachmentSerializer(serializers.ModelSerializer):
    """
    Serializer for submission attachments.
    """
    uploaded_by_name = serializers.CharField(source='uploaded_by.name', read_only=True)

    class Meta:
        model = SubmissionAttachment
        fields = [
            'id', 'submission', 'file_name', 'file_url', 'file_size',
            'file_type', 'uploaded_by', 'uploaded_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'created_at']

    def create(self, validated_data):
        """Set uploaded_by from request user."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['uploaded_by'] = request.user
        return super().create(validated_data)


class ContactFormAnalyticsSerializer(serializers.ModelSerializer):
    """
    Serializer for contact form analytics.
    """
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)

    class Meta:
        model = ContactFormAnalytics
        fields = [
            'id', 'session_id', 'event_type', 'event_type_display',
            'step_number', 'field_name', 'error_message', 'time_spent',
            'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        """Add request metadata."""
        request = self.context.get('request')
        if request:
            from apps.users.utils import get_client_ip, get_user_agent
            validated_data.update({
                'ip_address': get_client_ip(request),
                'user_agent': get_user_agent(request),
            })
        return super().create(validated_data)


class SubmissionStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating submission status.
    """
    notes = serializers.CharField(
        write_only=True,
        required=False,
        help_text='Optional notes about the status change'
    )

    class Meta:
        model = ContactSubmission
        fields = ['status', 'priority', 'assigned_to', 'notes']

    def update(self, instance, validated_data):
        """Update status and create note if provided."""
        notes_content = validated_data.pop('notes', None)
        
        # Track status change
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Update the instance
        instance = super().update(instance, validated_data)
        
        # Create status change note
        if notes_content or old_status != new_status:
            note_content = notes_content or f"Status changed from {old_status} to {new_status}"
            
            SubmissionNote.objects.create(
                submission=instance,
                author=self.context['request'].user,
                note_type='status_change',
                title=f"Status Update: {new_status.title()}",
                content=note_content,
                is_private=True
            )
        
        # Mark first response if status changed from new
        if old_status == 'new' and new_status != 'new':
            instance.mark_first_response()
        
        # Mark completed if status is completed
        if new_status == 'completed' and old_status != 'completed':
            instance.mark_completed()
        
        return instance