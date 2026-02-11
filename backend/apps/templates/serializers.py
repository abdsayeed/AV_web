"""
Serializers for Templates app.
"""
from rest_framework import serializers
from .models import Template


class TemplateListSerializer(serializers.ModelSerializer):
    """
    Serializer for template list view.
    """
    industry_display = serializers.CharField(source='get_industry_display', read_only=True)
    conversion_rate = serializers.ReadOnlyField()

    class Meta:
        model = Template
        fields = [
            'id', 'name', 'slug', 'industry', 'industry_display',
            'description', 'preview_image', 'features', 'badge',
            'price', 'is_featured', 'view_count', 'conversion_rate'
        ]


class TemplateDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for template detail view.
    """
    industry_display = serializers.CharField(source='get_industry_display', read_only=True)
    conversion_rate = serializers.ReadOnlyField()

    class Meta:
        model = Template
        fields = [
            'id', 'name', 'slug', 'industry', 'industry_display',
            'description', 'preview_image', 'demo_url', 'features',
            'badge', 'price', 'is_featured', 'view_count',
            'inquiry_count', 'conversion_rate', 'created_at'
        ]