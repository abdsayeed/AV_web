"""
URL configuration for Notifications app.
"""
from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='list'),
    path('<uuid:pk>/read/', views.MarkNotificationReadView.as_view(), name='mark_read'),
]