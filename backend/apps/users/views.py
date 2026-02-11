"""
Views for User app.
"""
from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login
from django.utils import timezone
from django.db import transaction
from .models import User, UserActivity
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserUpdateSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    EmailVerificationSerializer,
    UserActivitySerializer,
    UserListSerializer
)
from .utils import get_client_ip, get_user_agent, log_user_activity


class RegisterView(APIView):
    """
    User registration endpoint.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()
                
                # Log registration activity
                log_user_activity(
                    user=user,
                    action='register',
                    description='User registered successfully',
                    request=request
                )
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                # Send verification email (async task)
                # TODO: Implement email verification when Celery is set up
                # from .tasks import send_verification_email
                # send_verification_email.delay(user.id)
                
                return Response({
                    'success': True,
                    'message': 'Registration successful. Please check your email for verification.',
                    'user': UserProfileSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    User login endpoint.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            with transaction.atomic():
                # Update login info
                user.last_login = timezone.now()
                user.login_count += 1
                user.last_ip = get_client_ip(request)
                user.save(update_fields=['last_login', 'login_count', 'last_ip'])
                
                # Log login activity
                log_user_activity(
                    user=user,
                    action='login',
                    description='User logged in successfully',
                    request=request
                )
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'user': UserProfileSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    User logout endpoint.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Log logout activity
            log_user_activity(
                user=request.user,
                action='logout',
                description='User logged out successfully',
                request=request
            )
            
            return Response({
                'success': True,
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Error during logout'
            }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """
    User profile endpoint.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get user profile."""
        serializer = UserProfileSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        })

    def put(self, request):
        """Update user profile."""
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Log profile update
            log_user_activity(
                user=user,
                action='profile_update',
                description='User updated profile',
                request=request,
                metadata={'updated_fields': list(serializer.validated_data.keys())}
            )
            
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'user': UserProfileSerializer(user).data
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    Change password endpoint.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Log password change
            log_user_activity(
                user=user,
                action='password_reset',
                description='User changed password',
                request=request
            )
            
            return Response({
                'success': True,
                'message': 'Password changed successfully'
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """
    Password reset request endpoint.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email__iexact=email)
                token = user.generate_password_reset_token()
                
                # Send password reset email (async task)
                # TODO: Implement email sending when Celery is set up
                # from .tasks import send_password_reset_email
                # send_password_reset_email.delay(user.id, token)
                
                # Log password reset request
                log_user_activity(
                    user=user,
                    action='password_reset',
                    description='Password reset requested',
                    request=request
                )
                
            except User.DoesNotExist:
                # Don't reveal if email exists for security
                pass
            
            return Response({
                'success': True,
                'message': 'If the email exists, a password reset link has been sent.'
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """
    Password reset confirmation endpoint.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Log password reset completion
            log_user_activity(
                user=user,
                action='password_reset',
                description='Password reset completed',
                request=request
            )
            
            return Response({
                'success': True,
                'message': 'Password reset successful'
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class EmailVerificationView(APIView):
    """
    Email verification endpoint.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Log email verification
            log_user_activity(
                user=user,
                action='email_verify',
                description='Email verified successfully',
                request=request
            )
            
            return Response({
                'success': True,
                'message': 'Email verified successfully'
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ResendVerificationView(APIView):
    """
    Resend email verification endpoint.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        
        if user.is_verified:
            return Response({
                'success': False,
                'message': 'Email is already verified'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate new verification token
        token = user.generate_verification_token()
        
        # Send verification email (async task)
        # TODO: Implement email sending when Celery is set up
        # from .tasks import send_verification_email
        # send_verification_email.delay(user.id)
        
        return Response({
            'success': True,
            'message': 'Verification email sent'
        })


# Admin views
class UserListView(generics.ListAPIView):
    """
    List all users (admin only).
    """
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only allow admin users
        if not self.request.user.is_admin_user:
            return User.objects.none()
        
        queryset = super().get_queryset()
        
        # Filter by role
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        
        # Filter by status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Search by name or email
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) |
                models.Q(email__icontains=search) |
                models.Q(business_name__icontains=search)
            )
        
        return queryset


class UserActivityListView(generics.ListAPIView):
    """
    List user activities (admin only).
    """
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only allow admin users
        if not self.request.user.is_admin_user:
            return UserActivity.objects.none()
        
        queryset = UserActivity.objects.all().order_by('-created_at')
        
        # Filter by user
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Filter by action
        action = self.request.query_params.get('action')
        if action:
            queryset = queryset.filter(action=action)
        
        return queryset


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """
    Get user statistics (admin only).
    """
    if not request.user.is_admin_user:
        return Response({
            'success': False,
            'message': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    from django.db.models import Count
    from datetime import timedelta
    
    now = timezone.now()
    last_30_days = now - timedelta(days=30)
    
    stats = {
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'verified_users': User.objects.filter(is_verified=True).count(),
        'new_users_30_days': User.objects.filter(created_at__gte=last_30_days).count(),
        'users_by_role': dict(
            User.objects.values('role').annotate(count=Count('role'))
            .values_list('role', 'count')
        ),
        'recent_activities': UserActivitySerializer(
            UserActivity.objects.order_by('-created_at')[:10],
            many=True
        ).data
    }
    
    return Response({
        'success': True,
        'stats': stats
    })