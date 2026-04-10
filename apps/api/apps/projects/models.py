import uuid
from django.db import models
from apps.authentication.models import User
from apps.contact.models import ContactSubmission
from apps.templates_app.models import Template


class Project(models.Model):
    class Status(models.TextChoices):
        BRIEF = "brief", "Brief"
        DESIGN = "design", "Design"
        BUILD = "build", "Build"
        REVIEW = "review", "Review"
        LIVE = "live", "Live"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.OneToOneField(ContactSubmission, on_delete=models.CASCADE, related_name="project", db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects", db_index=True)
    template = models.ForeignKey(Template, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.BRIEF)
    live_url = models.URLField(blank=True, null=True)
    staging_url = models.URLField(blank=True, null=True)
    started_at = models.DateTimeField(null=True, blank=True)
    launched_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "projects"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user"]), models.Index(fields=["status"])]

    def __str__(self):
        return self.name


class ProjectStatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="status_history", db_index=True)
    status = models.CharField(max_length=20, choices=Project.Status.choices)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, db_index=True)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "project_status_history"
        ordering = ["-created_at"]


class ProjectFile(models.Model):
    class Category(models.TextChoices):
        ASSET = "asset", "Asset"
        CONTENT = "content", "Content"
        DELIVERABLE = "deliverable", "Deliverable"
        OTHER = "other", "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="files", db_index=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, db_index=True)
    file_name = models.CharField(max_length=255)
    file_url = models.URLField()
    file_size_bytes = models.PositiveBigIntegerField()
    mime_type = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.OTHER)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "project_files"
        ordering = ["-created_at"]


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="messages", db_index=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages", db_index=True)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "messages"
        ordering = ["created_at"]
        indexes = [models.Index(fields=["project"]), models.Index(fields=["sender"]), models.Index(fields=["is_read"])]
