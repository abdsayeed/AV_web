from .base import *  # noqa

DEBUG = True
ALLOWED_HOSTS = ["*"]

# Use in-memory cache in dev
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# Django debug toolbar (optional)
try:
    import debug_toolbar
    INSTALLED_APPS += ["debug_toolbar"]
    MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")
    INTERNAL_IPS = ["127.0.0.1"]
except ImportError:
    pass
