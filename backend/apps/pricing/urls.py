"""
URL configuration for Pricing app.
"""
from django.urls import path
from . import views

app_name = 'pricing'

urlpatterns = [
    path('plans/', views.PricingPlanListView.as_view(), name='plans'),
    path('plans/<slug:slug>/', views.PricingPlanDetailView.as_view(), name='plan_detail'),
]