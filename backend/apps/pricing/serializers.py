"""
Serializers for Pricing app.
"""
from rest_framework import serializers
from .models import PricingPlan


class PricingPlanSerializer(serializers.ModelSerializer):
    """
    Serializer for pricing plans.
    """
    conversion_rate = serializers.ReadOnlyField()

    class Meta:
        model = PricingPlan
        fields = [
            'id', 'name', 'slug', 'price', 'price_label', 'description',
            'features', 'contract_info', 'badge', 'color', 'icon',
            'is_featured', 'view_count', 'selection_count', 'conversion_rate'
        ]