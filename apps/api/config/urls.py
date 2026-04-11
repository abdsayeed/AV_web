from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth — all auth endpoints under /api/auth/
    path("api/auth/", include("apps.authentication.urls")),
    # Google OAuth
    path("auth/", include("social_django.urls", namespace="social")),
    # Features
    path("api/", include("apps.businesses.urls")),
    path("api/", include("apps.templates_app.urls")),
    path("api/", include("apps.pricing.urls")),
    path("api/", include("apps.contact.urls")),
    path("api/", include("apps.projects.urls")),
    path("api/", include("apps.notifications.urls")),
    path("api/", include("apps.analytics.urls")),
    # Health check
    path("api/health/", include("core.health_urls")),
]
