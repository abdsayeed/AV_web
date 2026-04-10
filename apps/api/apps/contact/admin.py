from django.contrib import admin
from .models import ContactSubmission, SubmissionService
from apps.analytics.models import AuditLog


class SubmissionServiceInline(admin.TabularInline):
    model = SubmissionService
    extra = 0


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ["reference_number", "business_name", "contact_name", "email", "status", "created_at"]
    list_filter = ["status", "website_type", "industry"]
    search_fields = ["reference_number", "business_name", "contact_name", "email"]
    ordering = ["-created_at"]
    readonly_fields = ["reference_number", "created_at", "updated_at"]
    inlines = [SubmissionServiceInline]
    actions = ["mark_reviewing", "mark_in_progress", "mark_completed", "mark_archived"]

    def save_model(self, request, obj, form, change):
        if change and "status" in form.changed_data:
            old = ContactSubmission.objects.get(pk=obj.pk)
            AuditLog.objects.create(
                actor=request.user,
                action="status_change",
                entity_type="ContactSubmission",
                entity_id=str(obj.pk),
                before_state={"status": old.status},
                after_state={"status": obj.status},
                ip_address=request.META.get("REMOTE_ADDR"),
            )
        super().save_model(request, obj, form, change)

    @admin.action(description="Mark selected as Reviewing")
    def mark_reviewing(self, request, qs):
        qs.update(status=ContactSubmission.Status.REVIEWING)

    @admin.action(description="Mark selected as In Progress")
    def mark_in_progress(self, request, qs):
        qs.update(status=ContactSubmission.Status.IN_PROGRESS)

    @admin.action(description="Mark selected as Completed")
    def mark_completed(self, request, qs):
        qs.update(status=ContactSubmission.Status.COMPLETED)

    @admin.action(description="Archive selected")
    def mark_archived(self, request, qs):
        qs.update(status=ContactSubmission.Status.ARCHIVED)
