"""
Views for Notifications app.
"""
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class NotificationListView(APIView):
    """
    List user notifications.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get user notifications."""
        # Basic implementation - return empty list for now
        return Response({
            'success': True,
            'notifications': [],
            'unread_count': 0
        })


class MarkNotificationReadView(APIView):
    """
    Mark notification as read.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """Mark notification as read."""
        # Basic implementation
        return Response({
            'success': True,
            'message': 'Notification marked as read'
        })