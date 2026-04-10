from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OAuthAccount, PasswordResetToken, EmailVerificationToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "name", "role", "is_verified", "is_active", "created_at"]
    list_filter = ["role", "is_verified", "is_active"]
    search_fields = ["email", "name"]
    ordering = ["-created_at"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal", {"fields": ("name", "avatar_url")}),
        ("Permissions", {"fields": ("role", "is_verified", "is_active", "is_staff", "is_superuser")}),
        ("Dates", {"fields": ("created_at", "updated_at", "deleted_at")}),
    )
    readonly_fields = ["created_at", "updated_at"]
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "name", "password1", "password2", "role")}),
    )


@admin.register(OAuthAccount)
class OAuthAccountAdmin(admin.ModelAdmin):
    list_display = ["user", "provider", "provider_account_id"]
    list_filter = ["provider"]
    search_fields = ["user__email", "provider_account_id"]
