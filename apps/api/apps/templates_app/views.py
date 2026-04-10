from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.cache import cache
from .models import Template, TemplateFeature


class TemplateFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateFeature
        fields = ["feature_text", "sort_order"]


class TemplateSerializer(serializers.ModelSerializer):
    features = TemplateFeatureSerializer(many=True, read_only=True)
    industry_label = serializers.CharField(source="industry.label", read_only=True)
    industry_slug = serializers.CharField(source="industry.slug", read_only=True)

    class Meta:
        model = Template
        fields = ["id", "slug", "name", "industry_label", "industry_slug",
                  "description", "preview_image_url", "demo_url", "badge",
                  "is_featured", "sort_order", "features"]


class TemplateListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        cached = cache.get("templates_list")
        if cached:
            return Response(cached)
        qs = Template.objects.filter(is_active=True).prefetch_related("features").select_related("industry")
        data = TemplateSerializer(qs, many=True).data
        cache.set("templates_list", data, timeout=3600)
        return Response(data)


class TemplateDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            t = Template.objects.prefetch_related("features").select_related("industry").get(slug=slug, is_active=True)
        except Template.DoesNotExist:
            from rest_framework import status
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TemplateSerializer(t).data)
