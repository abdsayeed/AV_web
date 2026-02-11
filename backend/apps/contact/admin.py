"""
Admin configuration for Contact app.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count
from .models import ContactSubmission, SubmissionNote, SubmissionAttachment, ContactFormAnalytics


class SubmissionNoteInline(admin.TabularInline):
    """
    Inline admin for submission notes.
    """
    model = SubmissionNote
    extra = 0
    readonly_fields = ['created_at', 'updated_at']
    fields = ['note_type', 'title', 'content', 'is_private', 'created_at']


class SubmissionAttachmentInline(admin.TabularInline):
    """
    Inline admin for submission attachments.
    """
    model = SubmissionAttachment
    extra = 0
    readonly_fields = ['created_at', 'file_size']
    fields = ['file_name', 'file_url', 'file_type', 'file_size', 'created_at']


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    """
    Admin interface for ContactSubmission model.
    """
    list_display = [
        'reference_number', 'business_name', 'contact_name', 'email',
        'status_badge', 'priority_badge', 'budget_range', 'assigned_to',
        'created_at', 'is_overdue_badge', 'estimated_value_display'
    ]
    list_filter = [
        'status', 'priority', 'source', 'budget_range', 'timeline',
        'industry', 'website_type', 'assigned_to', 'created_at',
        'email_sent', 'admin_notified'
    ]
    search_fields = [
        'reference_number', 'business_name', 'contact_name', 'email',
        'industry', 'additional_requirements'
    ]
    ordering = ['-created_at']
    readonly_fields = [
        'id', 'reference_number', 'created_at', 'updated_at',
        'estimated_value', 'is_overdue', 'response_time',
        'ip_address', 'user_agent', 'form_data'
    ]
    
    fieldsets = (
        ('Reference & Status', {
            'fields': (
                'reference_number', 'status', 'priority', 'assigned_to',
                'created_at', 'updated_at'
            )
        }),
        ('Context Information', {
            'fields': (
                'source', 'referrer', 'template_id', 'service_id', 'primary_goal'
            ),
            'classes': ('collapse',)
        }),
        ('Business Information', {
            'fields': (
                'business_name', 'industry', 'current_website', 'website_type'
            )
        }),
        ('Project Requirements', {
            'fields': (
                'services_needed', 'budget_range', 'timeline', 'target_date',
                'additional_requirements'
            )
        }),
        ('Contact Information', {
            'fields': (
                'contact_name', 'email', 'phone', 'preferred_contact',
                'best_time_to_reach'
            )
        }),
        ('Communication Tracking', {
            'fields': (
                'email_sent', 'admin_notified', 'follow_up_count',
                'first_response_at', 'last_contact_at', 'completed_at'
            ),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': (
                'id', 'ip_address', 'user_agent', 'form_data',
                'estimated_value', 'is_overdue', 'response_time'
            ),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [SubmissionNoteInline, SubmissionAttachmentInline]
    
    actions = [
        'mark_in_progress', 'mark_completed', 'assign_to_me',
        'send_follow_up', 'export_to_csv'
    ]
    
    def status_badge(self, obj):
        """Display status as colored badge."""
        colors = {
            'new': '#dc3545',
            'in_progress': '#ffc107',
            'completed': '#28a745',
            'cancelled': '#6c757d',
            'on_hold': '#17a2b8',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def priority_badge(self, obj):
        """Display priority as colored badge."""
        colors = {
            'low': '#28a745',
            'medium': '#ffc107',
            'high': '#fd7e14',
            'urgent': '#dc3545',
        }
        color = colors.get(obj.priority, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_priority_display()
        )
    priority_badge.short_description = 'Priority'
    
    def is_overdue_badge(self, obj):
        """Display overdue status."""
        if obj.is_overdue:
            return format_html(
                '<span style="background-color: #dc3545; color: white; padding: 2px 8px; '
                'border-radius: 3px; font-size: 11px;">OVERDUE</span>'
            )
        return ''
    is_overdue_badge.short_description = 'Overdue'
    
    def estimated_value_display(self, obj):
        """Display estimated value formatted."""
        return f"£{obj.estimated_value:,.2f}"
    estimated_value_display.short_description = 'Est. Value'
    estimated_value_display.admin_order_field = 'estimated_value'
    
    def mark_in_progress(self, request, queryset):
        """Mark selected submissions as in progress."""
        count = queryset.update(status='in_progress')
        self.message_user(request, f'{count} submissions marked as in progress.')
    mark_in_progress.short_description = 'Mark as In Progress'
    
    def mark_completed(self, request, queryset):
        """Mark selected submissions as completed."""
        count = 0
        for submission in queryset:
            submission.mark_completed()
            count += 1
        self.message_user(request, f'{count} submissions marked as completed.')
    mark_completed.short_description = 'Mark as Completed'
    
    def assign_to_me(self, request, queryset):
        """Assign selected submissions to current user."""
        count = queryset.update(assigned_to=request.user)
        self.message_user(request, f'{count} submissions assigned to you.')
    assign_to_me.short_description = 'Assign to me'
    
    def send_follow_up(self, request, queryset):
        """Send follow-up emails for selected submissions."""
        from .tasks import send_follow_up_email
        count = 0
        for submission in queryset:
            send_follow_up_email.delay(
                submission.id,
                'follow_up_general',
                {'subject': f'Following up on your project - {submission.reference_number}'}
            )
            count += 1
        self.message_user(request, f'Follow-up emails queued for {count} submissions.')
    send_follow_up.short_description = 'Send follow-up email'
    
    def export_to_csv(self, request, queryset):
        """Export selected submissions to CSV."""
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="submissions.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Reference', 'Business Name', 'Contact Name', 'Email', 'Phone',
            'Status', 'Priority', 'Budget Range', 'Industry', 'Created At',
            'Estimated Value'
        ])
        
        for submission in queryset:
            writer.writerow([
                submission.reference_number,
                submission.business_name,
                submission.contact_name,
                submission.email,
                submission.phone or '',
                submission.get_status_display(),
                submission.get_priority_display(),
                submission.get_budget_range_display(),
                submission.industry,
                submission.created_at.strftime('%Y-%m-%d %H:%M'),
                submission.estimated_value
            ])
        
        return response
    export_to_csv.short_description = 'Export to CSV'


@admin.register(SubmissionNote)
class SubmissionNoteAdmin(admin.ModelAdmin):
    """
    Admin interface for SubmissionNote model.
    """
    list_display = [
        'submission_ref', 'author', 'note_type', 'title', 'is_private', 'created_at'
    ]
    list_filter = ['note_type', 'is_private', 'created_at', 'author']
    search_fields = ['submission__reference_number', 'title', 'content']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    def submission_ref(self, obj):
        """Display submission reference number."""
        return obj.submission.reference_number
    submission_ref.short_description = 'Submission'
    submission_ref.admin_order_field = 'submission__reference_number'


@admin.register(SubmissionAttachment)
class SubmissionAttachmentAdmin(admin.ModelAdmin):
    """
    Admin interface for SubmissionAttachment model.
    """
    list_display = [
        'submission_ref', 'file_name', 'file_type', 'file_size_display',
        'uploaded_by', 'created_at'
    ]
    list_filter = ['file_type', 'created_at', 'uploaded_by']
    search_fields = ['submission__reference_number', 'file_name']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'file_size']
    
    def submission_ref(self, obj):
        """Display submission reference number."""
        return obj.submission.reference_number
    submission_ref.short_description = 'Submission'
    submission_ref.admin_order_field = 'submission__reference_number'
    
    def file_size_display(self, obj):
        """Display file size in human readable format."""
        size = obj.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    file_size_display.short_description = 'File Size'


@admin.register(ContactFormAnalytics)
class ContactFormAnalyticsAdmin(admin.ModelAdmin):
    """
    Admin interface for ContactFormAnalytics model.
    """
    list_display = [
        'session_id', 'event_type', 'step_number', 'field_name',
        'time_spent_display', 'created_at'
    ]
    list_filter = ['event_type', 'step_number', 'created_at']
    search_fields = ['session_id', 'field_name', 'error_message']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at']
    
    def time_spent_display(self, obj):
        """Display time spent in human readable format."""
        if obj.time_spent:
            minutes = obj.time_spent // 60
            seconds = obj.time_spent % 60
            return f"{minutes}m {seconds}s"
        return ''
    time_spent_display.short_description = 'Time Spent'
    
    def has_add_permission(self, request):
        """Disable adding analytics through admin."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Disable editing analytics through admin."""
        return False