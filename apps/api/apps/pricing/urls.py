from django.urls import path
from .views import PricingPlanListView, PricingPlanDetailView

urlpatterns = [
    path("pricing/plans/", PricingPlanListView.as_view(), name="pricing-list"),
    path("pricing/plans/<slug:slug>/", PricingPlanDetailView.as_view(), name="pricing-detail"),
]
