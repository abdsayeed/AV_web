import uuid
from django.db import models


class PricingPlan(models.Model):
    class Tier(models.TextChoices):
        BASIC = "basic", "Pay-As-You-Go"
        PRO = "pro", "Fully Managed Professional"
        CUSTOM = "custom", "Full Professional Website"

    class BillingPeriod(models.TextChoices):
        MONTHLY = "monthly", "Monthly"
        ONE_TIME = "one_time", "One-time"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=255)
    tier = models.CharField(max_length=20, choices=Tier.choices)
    # Stored in pence to avoid float precision issues. £59/mo = 5900, £249/mo = 24900
    price_pence = models.PositiveIntegerField()
    billing_period = models.CharField(max_length=20, choices=BillingPeriod.choices)
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "pricing_plans"
        ordering = ["sort_order"]
        indexes = [models.Index(fields=["slug"]), models.Index(fields=["tier"]), models.Index(fields=["is_active"])]

    def __str__(self):
        return f"{self.name} (£{self.price_pence / 100:.0f})"

    @property
    def price_display(self):
        if self.price_pence == 0:
            return "Custom"
        return f"£{self.price_pence // 100}"


class PlanFeature(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(PricingPlan, on_delete=models.CASCADE, related_name="features", db_index=True)
    feature_text = models.CharField(max_length=255)
    is_highlighted = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "plan_features"
        ordering = ["sort_order"]
