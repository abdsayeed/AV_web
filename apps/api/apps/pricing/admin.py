from django.contrib import admin
from .models import PricingPlan, PlanFeature


class PlanFeatureInline(admin.TabularInline):
    model = PlanFeature
    extra = 1


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ["name", "tier", "price_display", "billing_period", "is_popular", "is_active", "sort_order"]
    list_filter = ["tier", "billing_period", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    ordering = ["sort_order"]
    inlines = [PlanFeatureInline]
