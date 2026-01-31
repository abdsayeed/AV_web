"""
Template models for Aries Ventures backend.
"""
import uuid
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class Template(models.Model):
    """
    Model for website templates.
    """
    INDUSTRY_CHOICES = [
        ('barbershops', 'Barbershops'),
        ('cafes', 'Cafes & Eateries'),
        ('home_services', 'Home Services'),
        ('retail', 'Retail & E-commerce'),
        ('professional_services', 'Professional Services'),
        ('healthcare', 'Healthcare'),
        ('fitness', 'Fitness & Wellness'),
        ('education', 'Education'),
        ('real_estate', 'Real Estate'),
        ('automotive', 'Automotive'),
        ('general', 'General Business'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, help_text='Template name')
    slug = models.SlugField(max_length=255, unique=True, help_text='URL slug')
    industry = models.CharField(
        max_length=50,
        choices=INDUSTRY_CHOICES,
        help_text='Target industry'
    )
    description = models.TextField(help_text='Template description')
    
    # Visual assets
    preview_image = models.URLField(help_text='Preview image URL')
    demo_url = models.URLField(blank=True, null=True, help_text='Live demo URL')
    
    # Features and metadata
    features = models.JSONField(
        default=list,
        help_text='List of template features'
    )
    badge = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='Badge text (e.g., Popular, New, High Conversion)'
    )
    price = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='Price display text'
    )
    
    # Status and ordering
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    inquiry_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'templates'
        verbose_name = 'Template'
        verbose_name_plural = 'Templates'
        ordering = ['display_order', '-created_at']
        indexes = [
            models.Index(fields=['industry']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['display_order']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """Auto-generate slug from name."""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def conversion_rate(self):
        """Calculate conversion rate from views to inquiries."""
        if self.view_count > 0:
            return (self.inquiry_count / self.view_count) * 100
        return 0

    def increment_views(self):
        """Increment view count."""
        self.view_count += 1
        self.save(update_fields=['view_count'])

    def increment_inquiries(self):
        """Increment inquiry count."""
        self.inquiry_count += 1
        self.save(update_fields=['inquiry_count'])