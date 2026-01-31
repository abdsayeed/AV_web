"""
Views for Templates app.
"""
from rest_framework import generics, permissions
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Template
from .serializers import TemplateListSerializer, TemplateDetailSerializer


class TemplateListView(generics.ListAPIView):
    """
    List all active templates.
    """
    queryset = Template.objects.filter(is_active=True)
    serializer_class = TemplateListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['industry', 'is_featured']

    def get_queryset(self):
        """Order by featured first, then display order."""
        return super().get_queryset().order_by('-is_featured', 'display_order')


class TemplateDetailView(generics.RetrieveAPIView):
    """
    Retrieve template details and increment view count.
    """
    queryset = Template.objects.filter(is_active=True)
    serializer_class = TemplateDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        """Increment view count when template is viewed."""
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)