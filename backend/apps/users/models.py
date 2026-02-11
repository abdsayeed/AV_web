"""
User models for Aries Ventures backend.
"""
import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.core.validators import EmailValidator
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with email as the unique identifier.
    """
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        help_text='Email address used for login'
    )
    name = models.CharField(max_length=255, help_text='Full name')
    business_name = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text='Business or company name'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='customer',
        help_text='User role in the system'
    )
    
    # Account status
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(
        default=False,
        help_text='Email verification status'
    )
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Verification
    verification_token = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Token for email verification'
    )
    verification_token_expires = models.DateTimeField(null=True, blank=True)
    
    # Password reset
    password_reset_token = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Token for password reset'
    )
    password_reset_expires = models.DateTimeField(null=True, blank=True)
    
    # Profile information
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True, help_text='Profile picture URL')
    bio = models.TextField(blank=True, null=True, help_text='User biography')
    website = models.URLField(blank=True, null=True, help_text='Personal/business website')
    
    # Preferences
    email_notifications = models.BooleanField(
        default=True,
        help_text='Receive email notifications'
    )
    marketing_emails = models.BooleanField(
        default=False,
        help_text='Receive marketing emails'
    )
    
    # Metadata
    signup_source = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Source of user registration'
    )
    last_ip = models.GenericIPAddressField(null=True, blank=True)
    login_count = models.PositiveIntegerField(default=0)
    
    # Authentication Provider
    auth_provider = models.CharField(
        max_length=20,
        choices=[
            ('jwt', 'JWT'),
            ('google', 'Google'),
            ('facebook', 'Facebook'),
        ],
        default='jwt',
        help_text='Authentication provider'
    )
    # Legacy Auth0 field (kept for backward compatibility)
    auth0_sub = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        help_text='Legacy Auth0 subject identifier (deprecated)'
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
            models.Index(fields=['is_active']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f"{self.name} ({self.email})"

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name.split(' ')[0] if self.name else self.email

    @property
    def is_customer(self):
        return self.role == 'customer'

    @property
    def is_admin_user(self):
        return self.role == 'admin'

    @property
    def display_name(self):
        """Return the best display name for the user."""
        if self.business_name:
            return f"{self.name} ({self.business_name})"
        return self.name

    def generate_verification_token(self):
        """Generate a new email verification token."""
        import secrets
        self.verification_token = secrets.token_urlsafe(32)
        self.verification_token_expires = timezone.now() + timezone.timedelta(hours=24)
        self.save(update_fields=['verification_token', 'verification_token_expires'])
        return self.verification_token

    def generate_password_reset_token(self):
        """Generate a new password reset token."""
        import secrets
        self.password_reset_token = secrets.token_urlsafe(32)
        self.password_reset_expires = timezone.now() + timezone.timedelta(hours=1)
        self.save(update_fields=['password_reset_token', 'password_reset_expires'])
        return self.password_reset_token

    def verify_email(self):
        """Mark email as verified and clear verification token."""
        self.is_verified = True
        self.verification_token = None
        self.verification_token_expires = None
        self.save(update_fields=['is_verified', 'verification_token', 'verification_token_expires'])

    def clear_password_reset_token(self):
        """Clear password reset token after use."""
        self.password_reset_token = None
        self.password_reset_expires = None
        self.save(update_fields=['password_reset_token', 'password_reset_expires'])


class UserSession(models.Model):
    """
    Track user sessions for analytics and security.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    last_activity = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_sessions'
        verbose_name = 'User Session'
        verbose_name_plural = 'User Sessions'
        ordering = ['-last_activity']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['session_key']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.ip_address}"


class UserActivity(models.Model):
    """
    Track user activities for analytics.
    """
    ACTION_CHOICES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('register', 'Register'),
        ('password_reset', 'Password Reset'),
        ('email_verify', 'Email Verify'),
        ('profile_update', 'Profile Update'),
        ('form_submit', 'Form Submit'),
        ('template_view', 'Template View'),
        ('pricing_view', 'Pricing View'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='activities',
        null=True,
        blank=True
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'user_activities'
        verbose_name = 'User Activity'
        verbose_name_plural = 'User Activities'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'action']),
            models.Index(fields=['action']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        user_email = self.user.email if self.user else 'Anonymous'
        return f"{user_email} - {self.get_action_display()}"