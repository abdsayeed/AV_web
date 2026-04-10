"""
Django Channels WebSocket consumers for real-time notifications and project messages.

Connection URLs:
  ws://<host>/ws/notifications/          — personal notification stream
  ws://<host>/ws/projects/<project_id>/messages/  — project message thread
"""
import json
import logging
from django.db import models

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncWebsocketConsumer):
    """Personal notification stream for an authenticated user."""

    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close(code=4001)
            return

        self.group_name = f"user_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        logger.info(f"WS connected: notifications for user {user.id}")

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Receive broadcast from channel layer
    async def notification_message(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    # Heartbeat ping
    async def receive(self, text_data=None, bytes_data=None):
        if text_data == "ping":
            await self.send(text_data="pong")


class ProjectMessageConsumer(AsyncWebsocketConsumer):
    """Real-time message thread for a project."""

    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close(code=4001)
            return

        self.project_id = self.scope["url_route"]["kwargs"]["project_id"]

        # Verify user has access to this project
        has_access = await self._check_project_access(user, self.project_id)
        if not has_access:
            await self.close(code=4003)
            return

        self.group_name = f"project_{self.project_id}_messages"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if text_data == "ping":
            await self.send(text_data="pong")

    # Receive broadcast from channel layer
    async def project_message(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    @database_sync_to_async
    def _check_project_access(self, user, project_id):
        from apps.projects.models import Project
        return Project.objects.filter(
            id=project_id
        ).filter(
            models.Q(user=user) | models.Q(submission__assigned_to=user)
        ).exists()


def broadcast_notification(user_id: str, notification_data: dict):
    """
    Broadcast a notification to a user's WebSocket channel.
    Call this from Django signals or Trigger.dev jobs.
    """
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync

    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {"type": "notification_message", "data": notification_data},
    )


def broadcast_project_message(project_id: str, message_data: dict):
    """Broadcast a new message to all project participants."""
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync

    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    async_to_sync(channel_layer.group_send)(
        f"project_{project_id}_messages",
        {"type": "project_message", "data": message_data},
    )
