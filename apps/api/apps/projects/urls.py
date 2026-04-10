from django.urls import path
from .views import ProjectListView, ProjectDetailView, MessageListView, MessageReadView

urlpatterns = [
    path("projects/", ProjectListView.as_view(), name="project-list"),
    path("projects/<uuid:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path("projects/<uuid:project_id>/messages/", MessageListView.as_view(), name="message-list"),
    path("messages/<uuid:pk>/read/", MessageReadView.as_view(), name="message-read"),
]
