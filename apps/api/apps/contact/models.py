import uuid
from django.db import models
from apps.authentication.models import User
from apps.businesses.models import Industry
from apps.pricing.models import PricingPlan


def generate_reference():
    from django.utils import timezone
    import random
    year = timezone.now().year
    seq = random.randint(1000, 9999)
    return f"AV-{year}-{seq}"


class ContactSubmission(models.Model):
    class WebsiteType(models.TextChoices):
        NEW = "new", "New Website"
        REDESIGN = "redesign", "Redesign"
        LANDING_PAGE = "landing_page", "Landing Page"
        E_COMMERCE = "e_commerce", "E-Commerce"

    class Status(models.TextChoices):
        NEW = "new", "New"
        REVIEWING = "reviewing", "Reviewing"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        ARCHIVED = "archived", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="submissions", db_index=True)
    reference_number = models.CharField(max_length=20, unique=True, default=generate_reference)
    business_name = models.CharField(max_length=255)
    industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    website_type = models.CharField(max_length=20, choices=WebsiteType.choices)
    budget_tier = models.ForeignKey(PricingPlan, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    contact_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_submissions", db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "contact_submissions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["reference_number"]),
            models.Index(fields=["status"]),
            models.Index(fields=["user"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.reference_number} — {self.business_name}"


class SubmissionService(models.Model):
    class Service(models.TextChoices):
        SEO = "seo", "SEO"
        DESIGN = "design", "Design"
        MAINTENANCE = "maintenance", "Maintenance"
        CONTENT = "content", "Content"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(ContactSubmission, on_delete=models.CASCADE, related_name="services", db_index=True)
    service = models.CharField(max_length=20, choices=Service.choices)

    class Meta:
        db_table = "submission_services"
        unique_together = [("submission", "service")]
