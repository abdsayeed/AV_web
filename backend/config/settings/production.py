"""
Production settings for Aries Ventures backend (Fly.io).
"""
from .base import *
import os

DEBUG = False

# Fly.io sets FLY_APP_NAME automatically
FLY_APP_NAME = os.environ.get('FLY_APP_NAME', '')

ALLOWED_HOSTS = [
    f'{FLY_APP_NAME}.fly.dev',
    'av-web.fly.dev',
    'localhost',
    '127.0.0.1',
]

# Add any custom domain here
CUSTOM_DOMAIN = os.environ.get('CUSTOM_DOMAIN', '')
if CUSTOM_DOMAIN:
    ALLOWED_HOSTS.append(CUSTOM_DOMAIN)

# Database - use DATABASE_URL from fly.io postgres
import dj_database_url
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(default=DATABASE_URL, conn_max_age=600)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME', 'aries_ventures'),
            'USER': os.environ.get('DB_USER', 'postgres'),
            'PASSWORD': os.environ.get('DB_PASSWORD', ''),
            'HOST': os.environ.get('DB_HOST', 'localhost'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }

# CORS - allow Vercel frontend
VERCEL_URL = os.environ.get('VERCEL_URL', '')
CORS_ALLOWED_ORIGINS = [
    "https://ariesventures.co.uk",
    "https://www.ariesventures.co.uk",
]

# Add Vercel deployment URLs dynamically
EXTRA_CORS = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if EXTRA_CORS:
    CORS_ALLOWED_ORIGINS += [s.strip() for s in EXTRA_CORS.split(',')]

CORS_ALLOW_CREDENTIALS = True

# Static files - served by whitenoise
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Security
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'

# Email - Resend via SMTP
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.resend.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'resend'
EMAIL_HOST_PASSWORD = os.environ.get('RESEND_API_KEY', '')
DEFAULT_FROM_EMAIL = os.environ.get('FROM_EMAIL', 'noreply@ariesventures.co.uk')

# Disable Redis/Celery in production if not configured (use dummy cache)
REDIS_URL = os.environ.get('REDIS_URL', '')
if REDIS_URL:
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': REDIS_URL,
            'OPTIONS': {'CLIENT_CLASS': 'django_redis.client.DefaultClient'},
        }
    }
    CELERY_BROKER_URL = REDIS_URL
    CELERY_RESULT_BACKEND = REDIS_URL
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    }

# Logging to stdout (fly.io captures stdout)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
