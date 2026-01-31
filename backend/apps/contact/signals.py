"""
Signals for Contact app.
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import ContactSubmission, SubmissionNote
from .tasks import send_status_update_email


@receiver(post_save, sender=ContactSubmission)
def submission_post_save(sender, instance, created, **kwargs):
    """
    Handle submission post-save signal.
    """
    if created:
        # Log submission creation
        from apps.users.utils import log_user_activity
        log_user_activity(
            user=None,  # Anonymous submission
            action='form_submit',
            description=f'New contact form submission: {instance.reference_number}',
            metadata={
                'reference_number': instance.reference_number,
                'business_name': instance.business_name,
                'email': instance.email,
                'budget_range': instance.budget_range,
                'source': instance.source
            }
        )


@receiver(pre_save, sender=ContactSubmission)
def submission_pre_save(sender, instance, **kwargs):
    """
    Handle submission pre-save signal to track status changes.
    """
    if instance.pk:  # Only for existing instances
        try:
            old_instance = ContactSubmission.objects.get(pk=instance.pk)
            
            # Check if status changed
            if old_instance.status != instance.status:
                # Send status update email (async)
                send_status_update_email.delay(
                    instance.id,
                    old_instance.status,
                    instance.status
                )
                
                # Create automatic status change note
                SubmissionNote.objects.create(
                    submission=instance,
                    author_id=1,  # System user - you might want to create a system user
                    note_type='status_change',
                    title=f'Status changed from {old_instance.get_status_display()} to {instance.get_status_display()}',
                    content=f'Status automatically updated from {old_instance.get_status_display()} to {instance.get_status_display()}',
                    is_private=True
                )
        
        except ContactSubmission.DoesNotExist:
            pass


@receiver(post_save, sender=SubmissionNote)
def note_post_save(sender, instance, created, **kwargs):
    """
    Handle note post-save signal.
    """
    if created and instance.note_type == 'client_communication':
        # Update last contact time for the submission
        instance.submission.last_contact_at = instance.created_at
        instance.submission.save(update_fields=['last_contact_at'])