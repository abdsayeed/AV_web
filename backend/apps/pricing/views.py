"""
Views for Pricing app.
"""
from rest_framework import generics, permissions
from .models import PricingPlan
from .serializers import PricingPlanSerializer


class PricingPlanListView(generics.ListAPIView):
    """
    List all active pricing plans.
    """
    queryset = PricingPlan.objects.filter(is_active=True)
    serializer_class = PricingPlanSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """Order by featured first, then display order."""
        return super().get_queryset().order_by('-is_featured', 'display_order')


class PricingPlanDetailView(generics.RetrieveAPIView):
    """
    Retrieve pricing plan details and increment view count.
    """
    queryset = PricingPlan.objects.filter(is_active=True)
    serializer_class = PricingPlanSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        """Increment view count when plan is viewed."""
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)