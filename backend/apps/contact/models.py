"""
Contact form models for Aries Ventures backend.
"""
import uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


class ContactSubmission(models.Model):
    """
    Model for contact form submissions.
    """
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('on_hold', 'On Hold'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    SOURCE_CHOICES = [
        ('direct', 'Direct'),
        ('template', 'Template'),
        ('service', 'Service'),
        ('pricing', 'Pricing'),
        ('referral', 'Referral'),
        ('social', 'Social Media'),
        ('search', 'Search Engine'),
        ('other', 'Other'),
    ]
    
    GOAL_CHOICES = [
        ('new_website', 'Build a New Website'),
        ('redesign', 'Redesign Existing Site'),
        ('add_features', 'Add Features'),
        ('consultation', 'Consultation'),
        ('other', 'Something Else'),
    ]
    
    WEBSITE_TYPE_CHOICES = [
        ('ecommerce', 'E-commerce'),
        ('portfolio', 'Portfolio'),
        ('blog', 'Blog'),
        ('corporate', 'Corporate'),
        ('landing', 'Landing Page'),
        ('custom', 'Custom'),
    ]
    
    BUDGET_CHOICES = [
        ('pay_as_you_go', 'Pay-As-You-Go (£59/mo)'),
        ('fully_managed', 'Fully Managed (£249/mo)'),
        ('full_ownership', 'Full Ownership (Custom)'),
        ('custom', 'Custom Budget'),
    ]
    
    TIMELINE_CHOICES = [
        ('flexible', 'Flexible'),
        ('urgent', 'Urgent (ASAP)'),
        ('specific', 'Specific Date'),
    ]
    
    CONTACT_METHOD_CHOICES = [
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('either', 'Either'),
    ]
    
    TIME_PREFERENCE_CHOICES = [
        ('morning', 'Morning (9AM-12PM)'),
        ('afternoon', 'Afternoon (12PM-5PM)'),
        ('evening', 'Evening (5PM-8PM)'),
        ('anytime', 'Anytime'),
    ]

    # Primary fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference_number = models.CharField(
        max_length=50,
        unique=True,
        help_text='Unique reference number for this submission'
    )
    
    # Context information
    source = models.CharField(
        max_length=50,
        choices=SOURCE_CHOICES,
        default='direct',
        help_text='How the user found us'
    )
    referrer = models.URLField(
        blank=True,
        null=True,
        help_text='Referring URL'
    )
    template_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Template that led to this inquiry'
    )
    service_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='Service that led to this inquiry'
    )
    primary_goal = models.CharField(
        max_length=50,
        choices=GOAL_CHOICES,
        help_text='Primary goal for the project'
    )
    
    # Business information
    business_name = models.CharField(
        max_length=255,
        help_text='Business or company name'
    )
    industry = models.CharField(
        max_length=100,
        help_text='Business industry'
    )
    current_website = models.URLField(
        blank=True,
        null=True,
        help_text='Current website URL if any'
    )
    website_type = models.CharField(
        max_length=50,
        choices=WEBSITE_TYPE_CHOICES,
        help_text='Type of website needed'
    )
    
    # Project requirements
    services_needed = models.JSONField(
        default=list,
        help_text='List of services needed'
    )
    budget_range = models.CharField(
        max_length=50,
        choices=BUDGET_CHOICES,
        help_text='Budget range for the project'
    )
    timeline = models.CharField(
        max_length=50,
        choices=TIMELINE_CHOICES,
        help_text='Project timeline preference'
    )
    target_date = models.DateField(
        blank=True,
        null=True,
        help_text='Specific target date if timeline is specific'
    )
    additional_requirements = models.TextField(
        blank=True,
        null=True,
        help_text='Additional project requirements'
    )
    
    # Contact information
    contact_name = models.CharField(
        max_length=255,
        help_text='Contact person name'
    )
    email = models.EmailField(
        help_text='Contact email address'
    )
    phone = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='Contact phone number'
    )
    preferred_contact = models.CharField(
        max_length=20,
        choices=CONTACT_METHOD_CHOICES,
        default='email',
        help_text='Preferred contact method'
    )
    best_time_to_reach = models.CharField(
        max_length=20,
        choices=TIME_PREFERENCE_CHOICES,
        default='anytime',
        help_text='Best time to reach the contact'
    )
    
    # Status and assignment
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        help_text='Current status of the submission'
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='medium',
        help_text='Priority level'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_submissions',
        help_text='Staff member assigned to this submission'
    )
    
    # Metadata
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text='IP address of the submitter'
    )
    user_agent = models.TextField(
        blank=True,
        help_text='User agent string'
    )
    form_data = models.JSONField(
        default=dict,
        help_text='Complete form data as submitted'
    )
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    first_response_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When the first response was sent'
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When the submission was completed'
    )
    
    # Communication tracking
    email_sent = models.BooleanField(
        default=False,
        help_text='Whether confirmation email was sent'
    )
    admin_notified = models.BooleanField(
        default=False,
        help_text='Whether admin was notified'
    )
    follow_up_count = models.PositiveIntegerField(
        default=0,
        help_text='Number of follow-up communications'
    )
    last_contact_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Last time we contacted the client'
    )

    class Meta:
        db_table = 'contact_submissions'
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['email']),
            models.Index(fields=['reference_number']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['priority']),
            models.Index(fields=['source']),
        ]

    def __str__(self):
        return f"{self.reference_number} - {self.business_name}"

    @property
    def is_new(self):
        return self.status == 'new'

    @property
    def is_overdue(self):
        """Check if submission is overdue for response."""
        if self.first_response_at:
            return False
        
        # Consider overdue if no response within 24 hours
        cutoff = timezone.now() - timezone.timedelta(hours=24)
        return self.created_at < cutoff

    @property
    def response_time(self):
        """Calculate response time in hours."""
        if not self.first_response_at:
            return None
        
        delta = self.first_response_at - self.created_at
        return delta.total_seconds() / 3600  # Convert to hours

    @property
    def estimated_value(self):
        """Estimate project value based on budget range."""
        value_map = {
            'pay_as_you_go': 708,  # £59 * 12 months
            'fully_managed': 2988,  # £249 * 12 months
            'full_ownership': 5000,  # Estimated average
            'custom': 3000,  # Default estimate
        }
        return value_map.get(self.budget_range, 3000)

    def generate_reference_number(self):
        """Generate a unique reference number."""
        import random
        import string
        
        date_part = timezone.now().strftime('%Y%m')
        random_part = ''.join(random.choices(string.digits, k=4))
        return f"AV-{date_part}-{random_part}"

    def mark_first_response(self):
        """Mark the first response timestamp."""
        if not self.first_response_at:
            self.first_response_at = timezone.now()
            self.save(update_fields=['first_response_at'])

    def mark_completed(self):
        """Mark the submission as completed."""
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save(update_fields=['status', 'completed_at'])

    def increment_follow_up(self):
        """Increment follow-up count."""
        self.follow_up_count += 1
        self.last_contact_at = timezone.now()
        self.save(update_fields=['follow_up_count', 'last_contact_at'])


class SubmissionNote(models.Model):
    """
    Notes and comments on contact submissions.
    """
    NOTE_TYPES = [
        ('internal', 'Internal Note'),
        ('client_communication', 'Client Communication'),
        ('status_change', 'Status Change'),
        ('follow_up', 'Follow-up'),
        ('meeting', 'Meeting Notes'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(
        ContactSubmission,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='submission_notes'
    )
    note_type = models.CharField(
        max_length=30,
        choices=NOTE_TYPES,
        default='internal'
    )
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    is_private = models.BooleanField(
        default=True,
        help_text='Private notes are not visible to clients'
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'submission_notes'
        verbose_name = 'Submission Note'
        verbose_name_plural = 'Submission Notes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['submission', 'created_at']),
            models.Index(fields=['author']),
            models.Index(fields=['note_type']),
        ]

    def __str__(self):
        return f"Note for {self.submission.reference_number} by {self.author.name}"


class SubmissionAttachment(models.Model):
    """
    File attachments for contact submissions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(
        ContactSubmission,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file_name = models.CharField(max_length=255)
    file_url = models.URLField(help_text='URL to the uploaded file')
    file_size = models.PositiveIntegerField(help_text='File size in bytes')
    file_type = models.CharField(max_length=100, help_text='MIME type')
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text='User who uploaded the file'
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'submission_attachments'
        verbose_name = 'Submission Attachment'
        verbose_name_plural = 'Submission Attachments'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.file_name} - {self.submission.reference_number}"


class ContactFormAnalytics(models.Model):
    """
    Analytics for contact form performance.
    """
    EVENT_TYPES = [
        ('form_start', 'Form Started'),
        ('step_completed', 'Step Completed'),
        ('form_abandoned', 'Form Abandoned'),
        ('form_submitted', 'Form Submitted'),
        ('validation_error', 'Validation Error'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_id = models.CharField(
        max_length=100,
        help_text='Frontend session identifier'
    )
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    step_number = models.PositiveIntegerField(null=True, blank=True)
    field_name = models.CharField(max_length=100, blank=True)
    error_message = models.TextField(blank=True)
    time_spent = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Time spent in seconds'
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'contact_form_analytics'
        verbose_name = 'Form Analytics Event'
        verbose_name_plural = 'Form Analytics Events'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['session_id']),
            models.Index(fields=['event_type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.get_event_type_display()} - {self.session_id}"