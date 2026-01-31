"""
Signals for Users app.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User


@receiver(post_save, sender=User)
def user_post_save(sender, instance, created, **kwargs):
    """
    Handle user post-save signal.
    """
    if created:
        # Log user creation
        from .utils import log_user_activity
        log_user_activity(
            user=instance,
            action='register',
            description=f'User account created: {instance.email}',
            metadata={
                'signup_source': instance.signup_source,
                'role': instance.role
            }
        )