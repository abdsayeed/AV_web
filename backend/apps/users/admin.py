"""
Admin configuration for Users app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from .models import User, UserSession, UserActivity


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin interface for User model.
    """
    list_display = [
        'email', 'name', 'business_name', 'role', 'is_active', 
        'is_verified', 'created_at', 'last_login', 'login_count'
    ]
    list_filter = [
        'role', 'is_active', 'is_verified', 'is_staff', 'is_superuser',
        'created_at', 'last_login', 'email_notifications', 'marketing_emails'
    ]
    search_fields = ['email', 'name', 'business_name']
    ordering = ['-created_at']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'last_login', 'login_count',
        'verification_token', 'password_reset_token'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('email', 'name', 'business_name', 'role')
        }),
        ('Contact Information', {
            'fields': ('phone', 'website', 'avatar', 'bio'),
            'classes': ('collapse',)
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Account Status', {
            'fields': ('is_verified', 'verification_token', 'verification_token_expires'),
            'classes': ('collapse',)
        }),
        ('Password Reset', {
            'fields': ('password_reset_token', 'password_reset_expires'),
            'classes': ('collapse',)
        }),
        ('Preferences', {
            'fields': ('email_notifications', 'marketing_emails'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': (
                'id', 'signup_source', 'last_ip', 'login_count',
                'created_at', 'updated_at', 'last_login'
            ),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        ('Create User', {
            'classes': ('wide',),
            'fields': ('email', 'name', 'business_name', 'password1', 'password2', 'role'),
        }),
    )
    
    actions = ['verify_users', 'deactivate_users', 'activate_users', 'send_welcome_email']
    
    def verify_users(self, request, queryset):
        """Verify selected users."""
        count = 0
        for user in queryset:
            if not user.is_verified:
                user.verify_email()
                count += 1
        self.message_user(request, f'{count} users verified successfully.')
    verify_users.short_description = 'Verify selected users'
    
    def deactivate_users(self, request, queryset):
        """Deactivate selected users."""
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} users deactivated successfully.')
    deactivate_users.short_description = 'Deactivate selected users'
    
    def activate_users(self, request, queryset):
        """Activate selected users."""
        count = queryset.update(is_active=True)
        self.message_user(request, f'{count} users activated successfully.')
    activate_users.short_description = 'Activate selected users'
    
    def send_welcome_email(self, request, queryset):
        """Send welcome email to selected users."""
        from .tasks import send_welcome_email
        count = 0
        for user in queryset:
            send_welcome_email.delay(user.id)
            count += 1
        self.message_user(request, f'Welcome emails queued for {count} users.')
    send_welcome_email.short_description = 'Send welcome email'


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """
    Admin interface for UserSession model.
    """
    list_display = [
        'user_email', 'ip_address', 'created_at', 'last_activity', 'is_active'
    ]
    list_filter = ['is_active', 'created_at', 'last_activity']
    search_fields = ['user__email', 'ip_address', 'session_key']
    ordering = ['-last_activity']
    readonly_fields = ['id', 'session_key', 'created_at']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    """
    Admin interface for UserActivity model.
    """
    list_display = [
        'user_email', 'action', 'description', 'ip_address', 'created_at'
    ]
    list_filter = ['action', 'created_at']
    search_fields = ['user__email', 'description', 'ip_address']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at']
    
    def user_email(self, obj):
        if obj.user:
            return obj.user.email
        return 'Anonymous'
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'
    
    def has_add_permission(self, request):
        """Disable adding activities through admin."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Disable editing activities through admin."""
        return False