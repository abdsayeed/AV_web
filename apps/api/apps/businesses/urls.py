from django.urls import path
from .views import IndustryListView, BusinessView

urlpatterns = [
    path("industries/", IndustryListView.as_view(), name="industry-list"),
    path("business/", BusinessView.as_view(), name="business-detail"),
]
