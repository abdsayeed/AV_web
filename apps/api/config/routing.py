"""ASGI WebSocket routing."""
from django.urls import re_path
from apps.notifications.consumers import NotificationConsumer, ProjectMessageConsumer

websocket_urlpatterns = [
    re_path(r"^ws/notifications/$", NotificationConsumer.as_asgi()),
    re_path(r"^ws/projects/(?P<project_id>[0-9a-f-]+)/messages/$", ProjectMessageConsumer.as_asgi()),
]
