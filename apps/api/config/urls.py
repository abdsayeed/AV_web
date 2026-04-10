from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth
    path("api/auth/register/", include("apps.authentication.urls")),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
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
