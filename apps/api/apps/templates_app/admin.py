from django.contrib import admin
from .models import Template, TemplateFeature


class TemplateFeatureInline(admin.TabularInline):
    model = TemplateFeature
    extra = 1


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ["name", "industry", "badge", "is_featured", "is_active", "sort_order"]
    list_filter = ["industry", "badge", "is_featured", "is_active"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    ordering = ["sort_order"]
    inlines = [TemplateFeatureInline]
