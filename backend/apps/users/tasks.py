"""
Celery tasks for Users app.
"""
from celery import shared_task
from django.conf import settings
from django.utils import timezone
from django.template.loader import render_to_string
from django.core.mail import send_mail
from .models import User


@shared_task
def send_verification_email(user_id):
    """
    Send email verification email.
    """
    try:
        user = User.objects.get(id=user_id)
        
        if user.is_verified:
            return f"User {user.email} is already verified"
        
        # Prepare email context
        context = {
            'user': user,
            'verification_url': f"{settings.FRONTEND_URL}/verify-email?token={user.verification_token}",
            'site_name': 'Aries Ventures',
            'support_email': settings.DEFAULT_FROM_EMAIL
        }
        
        # Render email templates
        subject = 'Verify Your Email - Aries Ventures'
        html_message = render_to_string('emails/verification_email.html', context)
        text_message = render_to_string('emails/verification_email.txt', context)
        
        # Send email
        send_mail(
            subject=subject,
            message=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False
        )
        
        return f"Verification email sent to {user.email}"
        
    except User.DoesNotExist:
        return f"User with ID {user_id} not found"
    except Exception as e:
        return f"Error sending verification email: {str(e)}"


@shared_task
def send_password_reset_email(user_id, token):
    """
    Send password reset email.
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Prepare email context
        context = {
            'user': user,
            'reset_url': f"{settings.FRONTEND_URL}/reset-password?token={token}",
            'site_name': 'Aries Ventures',
            'support_email': settings.DEFAULT_FROM_EMAIL
        }
        
        # Render email templates
        subject = 'Reset Your Password - Aries Ventures'
        html_message = render_to_string('emails/password_reset_email.html', context)
        text_message = render_to_string('emails/password_reset_email.txt', context)
        
        # Send email
        send_mail(
            subject=subject,
            message=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False
        )
        
        return f"Password reset email sent to {user.email}"
        
    except User.DoesNotExist:
        return f"User with ID {user_id} not found"
    except Exception as e:
        return f"Error sending password reset email: {str(e)}"


@shared_task
def send_welcome_email(user_id):
    """
    Send welcome email to new users.
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Prepare email context
        context = {
            'user': user,
            'dashboard_url': f"{settings.FRONTEND_URL}/dashboard",
            'site_name': 'Aries Ventures',
            'support_email': settings.DEFAULT_FROM_EMAIL
        }
        
        # Render email templates
        subject = 'Welcome to Aries Ventures!'
        html_message = render_to_string('emails/welcome_email.html', context)
        text_message = render_to_string('emails/welcome_email.txt', context)
        
        # Send email
        send_mail(
            subject=subject,
            message=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False
        )
        
        return f"Welcome email sent to {user.email}"
        
    except User.DoesNotExist:
        return f"User with ID {user_id} not found"
    except Exception as e:
        return f"Error sending welcome email: {str(e)}"


@shared_task
def cleanup_expired_tokens():
    """
    Clean up expired verification and password reset tokens.
    """
    now = timezone.now()
    
    # Clear expired verification tokens
    verification_count = User.objects.filter(
        verification_token_expires__lt=now
    ).update(
        verification_token=None,
        verification_token_expires=None
    )
    
    # Clear expired password reset tokens
    reset_count = User.objects.filter(
        password_reset_expires__lt=now
    ).update(
        password_reset_token=None,
        password_reset_expires=None
    )
    
    return f"Cleaned up {verification_count} verification tokens and {reset_count} reset tokens"


@shared_task
def send_bulk_email(user_ids, subject, template_name, context_data=None):
    """
    Send bulk email to multiple users.
    """
    context_data = context_data or {}
    sent_count = 0
    failed_count = 0
    
    users = User.objects.filter(
        id__in=user_ids,
        is_active=True,
        email_notifications=True
    )
    
    for user in users:
        try:
            # Prepare email context
            context = {
                'user': user,
                'site_name': 'Aries Ventures',
                'support_email': settings.DEFAULT_FROM_EMAIL,
                **context_data
            }
            
            # Render email templates
            html_message = render_to_string(f'emails/{template_name}.html', context)
            text_message = render_to_string(f'emails/{template_name}.txt', context)
            
            # Send email
            send_mail(
                subject=subject,
                message=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False
            )
            
            sent_count += 1
            
        except Exception as e:
            failed_count += 1
            print(f"Failed to send email to {user.email}: {str(e)}")
    
    return f"Bulk email sent: {sent_count} successful, {failed_count} failed"