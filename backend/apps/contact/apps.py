from django.apps import AppConfig


class ContactConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.contact'
    verbose_name = 'Contact Forms'

    def ready(self):
        # import apps.contact.signals  # Commented out for now
        pass