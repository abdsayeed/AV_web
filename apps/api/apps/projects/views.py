from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Project, ProjectStatusHistory, ProjectFile, Message
from apps.notifications.consumers import broadcast_project_message


class ProjectStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source="changed_by.name", read_only=True)

    class Meta:
        model = ProjectStatusHistory
        fields = ["id", "status", "changed_by_name", "note", "created_at"]


class ProjectFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFile
        fields = ["id", "file_name", "file_url", "file_size_bytes", "mime_type", "category", "created_at"]


class ProjectSerializer(serializers.ModelSerializer):
    template_name = serializers.CharField(source="template.name", read_only=True)
    status_history = ProjectStatusHistorySerializer(many=True, read_only=True)
    files = ProjectFileSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "status", "template_name", "live_url", "staging_url",
                  "started_at", "launched_at", "created_at", "updated_at",
                  "status_history", "files"]


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.name", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "body", "sender_name", "is_read", "read_at", "created_at"]


class ProjectListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(user=request.user).select_related("template").order_by("-created_at")
        return Response(ProjectSerializer(projects, many=True).data)


class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            project = Project.objects.prefetch_related(
                "status_history__changed_by", "files"
            ).get(pk=pk, user=request.user)
        except Project.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProjectSerializer(project).data)


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(pk=project_id, user=request.user)
        except Project.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        messages = project.messages.select_related("sender").all()
        # Mark all as read
        messages.filter(is_read=False).exclude(sender=request.user).update(
            is_read=True, read_at=timezone.now()
        )
        return Response(MessageSerializer(messages, many=True).data)

    def post(self, request, project_id):
        try:
            project = Project.objects.get(pk=project_id, user=request.user)
        except Project.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        body = request.data.get("body", "").strip()
        if not body:
            return Response({"detail": "Message body required."}, status=status.HTTP_400_BAD_REQUEST)

        msg = Message.objects.create(project=project, sender=request.user, body=body)
        data = MessageSerializer(msg).data

        # Broadcast via WebSocket
        broadcast_project_message(str(project_id), data)

        return Response(data, status=status.HTTP_201_CREATED)


class MessageReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            msg = Message.objects.get(pk=pk, project__user=request.user)
        except Message.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        msg.is_read = True
        msg.read_at = timezone.now()
        msg.save(update_fields=["is_read", "read_at"])
        return Response({"detail": "Marked as read."})
