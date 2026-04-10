import uuid
from django.db import models
from apps.authentication.models import User


class AnalyticsEvent(models.Model):
    class EventType(models.TextChoices):
        PAGE_VIEW = "page_view", "Page View"
        CTA_CLICK = "cta_click", "CTA Click"
        FORM_START = "form_start", "Form Start"
        FORM_COMPLETE = "form_complete", "Form Complete"
        TEMPLATE_VIEW = "template_view", "Template View"
        DEMO_CLICK = "demo_click", "Demo Click"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    session_id = models.CharField(max_length=255, blank=True)  # anonymous tracking
    event_type = models.CharField(max_length=30, choices=EventType.choices)
    page_url = models.CharField(max_length=500)
    referrer = models.CharField(max_length=500, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "analytics_events"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["event_type"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["user"]),
            models.Index(fields=["session_id"]),
        ]
        # Append-only — no updates allowed


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    action = models.CharField(max_length=255)
    entity_type = models.CharField(max_length=100)
    entity_id = models.CharField(max_length=255)
    before_state = models.JSONField(null=True, blank=True)
    after_state = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "audit_logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["actor"]),
            models.Index(fields=["entity_type", "entity_id"]),
            models.Index(fields=["created_at"]),
        ]
        # Append-only — no updates allowed
