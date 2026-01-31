"""
Pricing models for Aries Ventures backend.
"""
import uuid
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class PricingPlan(models.Model):
    """
    Model for pricing plans.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, help_text='Plan name')
    slug = models.SlugField(max_length=255, unique=True, help_text='URL slug')
    price = models.CharField(max_length=50, help_text='Price display text')
    price_label = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='Price label (e.g., per month, one-time)'
    )
    description = models.TextField(help_text='Plan description')
    
    # Features
    features = models.JSONField(
        default=list,
        help_text='List of plan features'
    )
    contract_info = models.TextField(
        blank=True,
        null=True,
        help_text='Contract and safety information'
    )
    
    # Visual elements
    badge = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='Badge text (e.g., Popular, Best Value)'
    )
    color = models.CharField(
        max_length=50,
        default='blue',
        help_text='Color theme for the plan'
    )
    icon = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text='Icon identifier'
    )
    
    # Status and ordering
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    selection_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pricing_plans'
        verbose_name = 'Pricing Plan'
        verbose_name_plural = 'Pricing Plans'
        ordering = ['display_order', 'name']
        indexes = [
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
        """Calculate conversion rate from views to selections."""
        if self.view_count > 0:
            return (self.selection_count / self.view_count) * 100
        return 0

    def increment_views(self):
        """Increment view count."""
        self.view_count += 1
        self.save(update_fields=['view_count'])

    def increment_selections(self):
        """Increment selection count."""
        self.selection_count += 1
        self.save(update_fields=['selection_count'])