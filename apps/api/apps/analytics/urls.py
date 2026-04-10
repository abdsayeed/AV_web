from django.urls import path
from .views import AnalyticsEventView, AnalyticsDashboardView

urlpatterns = [
    path("analytics/event/", AnalyticsEventView.as_view(), name="analytics-event"),
    path("admin/analytics/", AnalyticsDashboardView.as_view(), name="analytics-dashboard"),
]
