from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AnalyticsEvent, AuditLog


class AnalyticsEventSerializer(serializers.Serializer):
    event_type = serializers.ChoiceField(choices=AnalyticsEvent.EventType.choices)
    page_url = serializers.CharField(max_length=500)
    referrer = serializers.CharField(max_length=500, required=False, allow_blank=True)
    session_id = serializers.CharField(max_length=255, required=False, allow_blank=True)
    metadata = serializers.DictField(required=False, default=dict)


class AnalyticsEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AnalyticsEventSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        AnalyticsEvent.objects.create(
            user=request.user if request.user.is_authenticated else None,
            **serializer.validated_data,
        )
        return Response({"detail": "Event recorded."}, status=status.HTTP_201_CREATED)


class AnalyticsDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)

        # Page views over last 30 days
        from django.utils import timezone
        from datetime import timedelta
        since = timezone.now() - timedelta(days=30)

        page_views = (
            AnalyticsEvent.objects
            .filter(event_type="page_view", created_at__gte=since)
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(count=Count("id"))
            .order_by("date")
        )

        # Event type breakdown
        event_breakdown = (
            AnalyticsEvent.objects
            .filter(created_at__gte=since)
            .values("event_type")
            .annotate(count=Count("id"))
        )

        # Top pages
        top_pages = (
            AnalyticsEvent.objects
            .filter(event_type="page_view", created_at__gte=since)
            .values("page_url")
            .annotate(count=Count("id"))
            .order_by("-count")[:10]
        )

        return Response({
            "page_views_over_time": list(page_views),
            "event_breakdown": list(event_breakdown),
            "top_pages": list(top_pages),
        })
