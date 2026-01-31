"""
Analytics models for Aries Ventures backend.
"""
import uuid
from django.db import models
from django.utils import timezone


class AnalyticsEvent(models.Model):
    """
    Model for tracking analytics events.
    """
    EVENT_TYPES = [
        ('page_view', 'Page View'),
        ('button_click', 'Button Click'),
        ('form_start', 'Form Start'),
        ('form_complete', 'Form Complete'),
        ('template_view', 'Template View'),
        ('pricing_view', 'Pricing View'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    page_url = models.URLField()
    referrer = models.URLField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'analytics_events'
        verbose_name = 'Analytics Event'
        verbose_name_plural = 'Analytics Events'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type']),
            models.Index(fields=['created_at']),
            models.Index(fields=['session_id']),
        ]

    def __str__(self):
        return f"{self.get_event_type_display()} - {self.page_url}"