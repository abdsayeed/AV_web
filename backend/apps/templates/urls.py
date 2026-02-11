"""
URL configuration for Templates app.
"""
from django.urls import path
from . import views

app_name = 'templates'

urlpatterns = [
    path('', views.TemplateListView.as_view(), name='list'),
    path('<slug:slug>/', views.TemplateDetailView.as_view(), name='detail'),
]