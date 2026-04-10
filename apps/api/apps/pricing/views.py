from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.cache import cache
from .models import PricingPlan, PlanFeature


class PlanFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanFeature
        fields = ["feature_text", "is_highlighted", "sort_order"]


class PricingPlanSerializer(serializers.ModelSerializer):
    features = PlanFeatureSerializer(many=True, read_only=True)
    price_display = serializers.ReadOnlyField()

    class Meta:
        model = PricingPlan
        fields = ["id", "slug", "name", "tier", "price_pence", "price_display",
                  "billing_period", "is_popular", "sort_order", "features"]


class PricingPlanListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        cached = cache.get("pricing_plans_list")
        if cached:
            return Response(cached)
        qs = PricingPlan.objects.filter(is_active=True).prefetch_related("features")
        data = PricingPlanSerializer(qs, many=True).data
        cache.set("pricing_plans_list", data, timeout=3600)
        return Response(data)


class PricingPlanDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            plan = PricingPlan.objects.prefetch_related("features").get(slug=slug, is_active=True)
        except PricingPlan.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(PricingPlanSerializer(plan).data)
