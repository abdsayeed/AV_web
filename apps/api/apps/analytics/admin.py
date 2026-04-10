from django.contrib import admin
from .models import AnalyticsEvent, AuditLog


@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = ["event_type", "page_url", "user", "session_id", "created_at"]
    list_filter = ["event_type"]
    search_fields = ["page_url", "session_id", "user__email"]
    ordering = ["-created_at"]
    readonly_fields = ["id", "created_at"]

    def has_change_permission(self, request, obj=None):
        return False  # Append-only


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "entity_type", "entity_id", "actor", "ip_address", "created_at"]
    list_filter = ["entity_type", "action"]
    search_fields = ["actor__email", "entity_id", "action"]
    ordering = ["-created_at"]
    readonly_fields = ["id", "created_at"]

    def has_change_permission(self, request, obj=None):
        return False  # Append-only

    def has_delete_permission(self, request, obj=None):
        return False  # Append-only
