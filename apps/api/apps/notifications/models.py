import uuid
from django.db import models
from apps.authentication.models import User


class Notification(models.Model):
    class Type(models.TextChoices):
        PROJECT_UPDATE = "project_update", "Project Update"
        MESSAGE = "message", "Message"
        SYSTEM = "system", "System"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications", db_index=True)
    type = models.CharField(max_length=20, choices=Type.choices)
    title = models.CharField(max_length=255)
    body = models.TextField()
    action_url = models.CharField(max_length=500, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user"]), models.Index(fields=["is_read"])]

    def __str__(self):
        return f"{self.type}: {self.title} → {self.user.email}"
