"""
Celery tasks for Contact app.
"""
from celery import shared_task
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils import timezone
from .models import ContactSubmission
from .utils import format_submission_summary, get_submission_priority


@shared_task
def send_confirmation_email(submission_id):
    """
    Send confirmation email to customer.
    """
    try:
        submission = ContactSubmission.objects.get(id=submission_id)
        
        # Format submission data for template
        submission_data = format_submission_summary(submission)
        
        # Prepare email context
        context = {
            'submission': submission_data,
            'site_name': 'Aries Ventures',
            'support_email': settings.DEFAULT_FROM_EMAIL,
            'dashboard_url': f"{settings.FRONTEND_URL}/track?ref={submission.reference_number}&email={submission.email}",
            'contact_url': f"{settings.FRONTEND_URL}/contact",
        }
        
        # Render email templates
        subject = f'We received your inquiry - Ref: {submission.reference_number}'
        html_message = render_to_string('emails/contact_confirmation.html', context)
        text_message = render_to_string('emails/contact_confirmation.txt', context)
        
        # Create email message
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[submission.email],
            reply_to=['hello@ariesventures.co.uk']
        )
        email.attach_alternative(html_message, "text/html")
        
        # Send email
        email.send(fail_silently=False)
        
        # Mark email as sent
        submission.email_sent = True
        submission.save(update_fields=['email_sent'])
        
        return f"Confirmation email sent to {submission.email}"
        
    except ContactSubmission.DoesNotExist:
        return f"Submission with ID {submission_id} not found"
    except Exception as e:
        return f"Error sending confirmation email: {str(e)}"


@shared_task
def send_admin_notification(submission_id):
    """
    Send notification email to admin team.
    """
    try:
        submission = ContactSubmission.objects.get(id=submission_id)
        
        # Calculate priority
        priority = get_submission_priority(submission)
        submission.priority = priority
        submission.save(update_fields=['priority'])
        
        # Format submission data for template
        submission_data = format_submission_summary(submission)
        
        # Prepare email context
        context = {
            'submission': submission_data,
            'priority': priority.upper(),
            'admin_url': f"{settings.ADMIN_URL}/contact/submissions/{submission.id}/",
            'site_name': 'Aries Ventures',
        }
        
        # Render email templates
        subject = f'🚨 New Project Inquiry - {submission.business_name} (Ref: {submission.reference_number})'
        if priority in ['urgent', 'high']:
            subject = f'🔥 HIGH PRIORITY - {subject}'
        
        html_message = render_to_string('emails/admin_notification.html', context)
        text_message = render_to_string('emails/admin_notification.txt', context)
        
        # Admin email addresses
        admin_emails = [
            'admin@ariesventures.co.uk',
            'hello@ariesventures.co.uk',
        ]
        
        # Create email message
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=admin_emails,
            reply_to=[submission.email]
        )
        email.attach_alternative(html_message, "text/html")
        
        # Send email
        email.send(fail_silently=False)
        
        # Mark admin as notified
        submission.admin_notified = True
        submission.save(update_fields=['admin_notified'])
        
        return f"Admin notification sent for {submission.reference_number}"
        
    except ContactSubmission.DoesNotExist:
        return f"Submission with ID {submission_id} not found"
    except Exception as e:
        return f"Error sending admin notification: {str(e)}"


@shared_task
def send_status_update_email(submission_id, old_status, new_status, notes=None):
    """
    Send status update email to customer.
    """
    try:
        submission = ContactSubmission.objects.get(id=submission_id)
        
        # Format submission data for template
        submission_data = format_submission_summary(submission)
        
        # Prepare email context
        context = {
            'submission': submission_data,
            'old_status': old_status.replace('_', ' ').title(),
            'new_status': new_status.replace('_', ' ').title(),
            'notes': notes,
            'site_name': 'Aries Ventures',
            'support_email': settings.DEFAULT_FROM_EMAIL,
            'tracking_url': f"{settings.FRONTEND_URL}/track?ref={submission.reference_number}&email={submission.email}",
        }
        
        # Render email templates
        subject = f'Update on Your Project - Ref: {submission.reference_number}'
        html_message = render_to_string('emails/status_update.html', context)
        text_message = render_to_string('emails/status_update.txt', context)
        
        # Create email message
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[submission.email],
            reply_to=['hello@ariesventures.co.uk']
        )
        email.attach_alternative(html_message, "text/html")
        
        # Send email
        email.send(fail_silently=False)
        
        # Update last contact time
        submission.last_contact_at = timezone.now()
        submission.save(update_fields=['last_contact_at'])
        
        return f"Status update email sent to {submission.email}"
        
    except ContactSubmission.DoesNotExist:
        return f"Submission with ID {submission_id} not found"
    except Exception as e:
        return f"Error sending status update email: {str(e)}"


@shared_task
def send_follow_up_email(submission_id, template_name, context_data=None):
    """
    Send follow-up email to customer.
    """
    try:
        submission = ContactSubmission.objects.get(id=submission_id)
        context_data = context_data or {}
        
        # Format submission data for template
        submission_data = format_submission_summary(submission)
        
        # Prepare email context
        context = {
            'submission': submission_data,
            'site_name': 'Aries Ventures',
            'support_email': settings.DEFAULT_FROM_EMAIL,
            'contact_url': f"{settings.FRONTEND_URL}/contact",
            **context_data
        }
        
        # Render email templates
        subject = context_data.get('subject', f'Follow-up on Your Project - Ref: {submission.reference_number}')
        html_message = render_to_string(f'emails/{template_name}.html', context)
        text_message = render_to_string(f'emails/{template_name}.txt', context)
        
        # Create email message
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[submission.email],
            reply_to=['hello@ariesventures.co.uk']
        )
        email.attach_alternative(html_message, "text/html")
        
        # Send email
        email.send(fail_silently=False)
        
        # Increment follow-up count
        submission.increment_follow_up()
        
        return f"Follow-up email sent to {submission.email}"
        
    except ContactSubmission.DoesNotExist:
        return f"Submission with ID {submission_id} not found"
    except Exception as e:
        return f"Error sending follow-up email: {str(e)}"


@shared_task
def process_overdue_submissions():
    """
    Process overdue submissions and send notifications.
    """
    from datetime import timedelta
    
    now = timezone.now()
    overdue_cutoff = now - timedelta(hours=24)
    urgent_cutoff = now - timedelta(hours=48)
    
    # Find overdue submissions
    overdue_submissions = ContactSubmission.objects.filter(
        status='new',
        first_response_at__isnull=True,
        created_at__lt=overdue_cutoff
    )
    
    processed_count = 0
    
    for submission in overdue_submissions:
        # Send urgent notification for submissions over 48 hours old
        if submission.created_at < urgent_cutoff:
            send_admin_notification.delay(
                submission.id,
                urgent=True,
                subject_prefix='🚨 URGENT OVERDUE'
            )
        
        # Update priority to high if not already urgent
        if submission.priority not in ['urgent', 'high']:
            submission.priority = 'high'
            submission.save(update_fields=['priority'])
        
        processed_count += 1
    
    return f"Processed {processed_count} overdue submissions"


@shared_task
def send_daily_summary():
    """
    Send daily summary email to admin team.
    """
    try:
        from datetime import timedelta
        from django.db.models import Count
        
        now = timezone.now()
        yesterday = now - timedelta(days=1)
        
        # Get daily statistics
        new_submissions = ContactSubmission.objects.filter(
            created_at__gte=yesterday
        ).count()
        
        pending_submissions = ContactSubmission.objects.filter(
            status='new'
        ).count()
        
        overdue_submissions = ContactSubmission.objects.filter(
            status='new',
            first_response_at__isnull=True,
            created_at__lt=now - timedelta(hours=24)
        ).count()
        
        # Recent submissions
        recent_submissions = ContactSubmission.objects.filter(
            created_at__gte=yesterday
        ).select_related('assigned_to')[:10]
        
        # Prepare email context
        context = {
            'date': yesterday.strftime('%B %d, %Y'),
            'stats': {
                'new_submissions': new_submissions,
                'pending_submissions': pending_submissions,
                'overdue_submissions': overdue_submissions,
            },
            'recent_submissions': [
                format_submission_summary(sub) for sub in recent_submissions
            ],
            'admin_url': f"{settings.ADMIN_URL}/contact/submissions/",
            'site_name': 'Aries Ventures',
        }
        
        # Render email templates
        subject = f'Daily Summary - {new_submissions} New Inquiries'
        html_message = render_to_string('emails/daily_summary.html', context)
        text_message = render_to_string('emails/daily_summary.txt', context)
        
        # Admin email addresses
        admin_emails = [
            'admin@ariesventures.co.uk',
        ]
        
        # Create email message
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=admin_emails
        )
        email.attach_alternative(html_message, "text/html")
        
        # Send email
        email.send(fail_silently=False)
        
        return f"Daily summary sent: {new_submissions} new submissions"
        
    except Exception as e:
        return f"Error sending daily summary: {str(e)}"