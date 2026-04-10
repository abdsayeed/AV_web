import uuid
from django.db import models
from apps.businesses.models import Industry


class Template(models.Model):
    class Badge(models.TextChoices):
        POPULAR = "popular", "Popular"
        HIGH_CONVERSION = "high_conversion", "High Conversion"
        NEW = "new", "New"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=255)
    industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    description = models.TextField()
    preview_image_url = models.URLField()
    demo_url = models.URLField()
    badge = models.CharField(max_length=20, choices=Badge.choices, blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "templates"
        ordering = ["sort_order", "name"]
        indexes = [models.Index(fields=["slug"]), models.Index(fields=["industry"]), models.Index(fields=["is_active"])]

    def __str__(self):
        return self.name


class TemplateFeature(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template = models.ForeignKey(Template, on_delete=models.CASCADE, related_name="features", db_index=True)
    feature_text = models.CharField(max_length=255)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "template_features"
        ordering = ["sort_order"]
