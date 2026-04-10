from django.contrib import admin
from .models import Project, ProjectStatusHistory, ProjectFile, Message
from apps.analytics.models import AuditLog


class ProjectStatusHistoryInline(admin.TabularInline):
    model = ProjectStatusHistory
    extra = 0
    readonly_fields = ["created_at"]


class ProjectFileInline(admin.TabularInline):
    model = ProjectFile
    extra = 0
    readonly_fields = ["created_at"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name", "user", "status", "template", "live_url", "created_at"]
    list_filter = ["status"]
    search_fields = ["name", "user__email"]
    ordering = ["-created_at"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ProjectStatusHistoryInline, ProjectFileInline]

    def save_model(self, request, obj, form, change):
        if change and "status" in form.changed_data:
            old = Project.objects.get(pk=obj.pk)
            ProjectStatusHistory.objects.create(
                project=obj,
                status=obj.status,
                changed_by=request.user,
                note=f"Status changed from {old.status} to {obj.status} by admin",
            )
            AuditLog.objects.create(
                actor=request.user,
                action="project_status_change",
                entity_type="Project",
                entity_id=str(obj.pk),
                before_state={"status": old.status},
                after_state={"status": obj.status},
                ip_address=request.META.get("REMOTE_ADDR"),
            )
        super().save_model(request, obj, form, change)
