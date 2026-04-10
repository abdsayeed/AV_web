"""
Email sending via Resend SDK, dispatched through Trigger.dev background jobs.
The view fires the trigger and returns immediately — the job handles retries.
"""
import os
import logging

logger = logging.getLogger(__name__)


def send_email_async(template_name: str, to_email: str, context: dict):
    """
    Enqueue an email send job via Trigger.dev HTTP trigger.
    Falls back to direct Resend send if Trigger.dev is not configured.
    """
    trigger_api_key = os.environ.get("TRIGGER_API_KEY")
    trigger_api_url = os.environ.get("TRIGGER_API_URL", "https://api.trigger.dev")

    if trigger_api_key:
        try:
            import requests
            requests.post(
                f"{trigger_api_url}/api/v1/events",
                headers={"Authorization": f"Bearer {trigger_api_key}", "Content-Type": "application/json"},
                json={
                    "name": f"email.{template_name}",
                    "payload": {"to": to_email, "template": template_name, "context": context},
                },
                timeout=5,
            )
        except Exception as e:
            logger.warning(f"Trigger.dev enqueue failed, falling back to direct send: {e}")
            _send_direct(template_name, to_email, context)
    else:
        _send_direct(template_name, to_email, context)


def _send_direct(template_name: str, to_email: str, context: dict):
    """Direct Resend send — used in dev or as fallback."""
    api_key = os.environ.get("RESEND_API_KEY")
    from_email = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")

    if not api_key:
        logger.warning(f"RESEND_API_KEY not set — skipping email to {to_email} (template: {template_name})")
        return

    try:
        import resend
        resend.api_key = api_key

        subject, html = _render_template(template_name, context)
        resend.Emails.send({
            "from": f"Aries Ventures <{from_email}>",
            "to": [to_email],
            "subject": subject,
            "html": html,
        })
        logger.info(f"Email sent: {template_name} → {to_email}")
    except Exception as e:
        logger.error(f"Email send failed: {e}")


def _render_template(template_name: str, context: dict) -> tuple[str, str]:
    """Render Django HTML email template."""
    from django.template.loader import render_to_string

    templates = {
        "welcome": ("Welcome to Aries Ventures", "emails/welcome.html"),
        "email_verification": ("Verify your email — Aries Ventures", "emails/email_verification.html"),
        "password_reset": ("Reset your password — Aries Ventures", "emails/password_reset.html"),
        "contact_confirmation": ("We received your enquiry — Aries Ventures", "emails/contact_confirmation.html"),
        "internal_lead_alert": ("New lead submission", "emails/internal_lead_alert.html"),
        "project_status_update": ("Your project has been updated", "emails/project_status_update.html"),
        "new_message": ("New message on your project", "emails/new_message.html"),
        "plan_confirmation": ("Plan confirmed — Aries Ventures", "emails/plan_confirmation.html"),
    }

    subject, template_path = templates.get(template_name, ("Aries Ventures", "emails/base.html"))
    html = render_to_string(template_path, context)
    return subject, html
