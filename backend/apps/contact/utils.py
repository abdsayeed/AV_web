"""
Utility functions for Contact app.
"""
from django.conf import settings
from .models import ContactSubmission


def send_submission_emails(submission_id):
    """
    Send confirmation and notification emails for a submission.
    """
    from .tasks import send_confirmation_email, send_admin_notification
    
    # Send confirmation email to customer
    send_confirmation_email.delay(submission_id)
    
    # Send notification email to admin
    send_admin_notification.delay(submission_id)


def generate_reference_number():
    """
    Generate a unique reference number for submissions.
    """
    import random
    import string
    from django.utils import timezone
    
    date_part = timezone.now().strftime('%Y%m')
    random_part = ''.join(random.choices(string.digits, k=4))
    return f"AV-{date_part}-{random_part}"


def calculate_estimated_timeline(services_needed, budget_range, website_type):
    """
    Calculate estimated project timeline based on requirements.
    """
    base_weeks = {
        'pay_as_you_go': 2,
        'fully_managed': 4,
        'full_ownership': 8,
        'custom': 6,
    }
    
    weeks = base_weeks.get(budget_range, 6)
    
    # Add time for complex website types
    if website_type in ['ecommerce', 'custom']:
        weeks += 2
    
    # Add time for additional services
    service_multipliers = {
        'ecommerce_solutions': 2,
        'seo_optimization': 1,
        'ui_ux_design': 1,
        'content_creation': 1,
    }
    
    for service in services_needed:
        weeks += service_multipliers.get(service, 0)
    
    return f"{weeks}-{weeks + 2} weeks"


def get_recommended_services(industry, website_type, budget_range):
    """
    Get recommended services based on business profile.
    """
    recommendations = []
    
    # Industry-specific recommendations
    industry_services = {
        'barbershops': ['ui_ux_design', 'seo_optimization'],
        'cafes': ['ecommerce_solutions', 'content_creation'],
        'home_services': ['seo_optimization', 'maintenance_support'],
        'retail': ['ecommerce_solutions', 'ui_ux_design'],
        'professional_services': ['content_creation', 'seo_optimization'],
    }
    
    recommendations.extend(industry_services.get(industry, []))
    
    # Website type recommendations
    if website_type == 'ecommerce':
        recommendations.extend(['ecommerce_solutions', 'ui_ux_design'])
    elif website_type == 'portfolio':
        recommendations.extend(['ui_ux_design', 'content_creation'])
    elif website_type == 'blog':
        recommendations.extend(['content_creation', 'seo_optimization'])
    
    # Budget-based recommendations
    if budget_range in ['fully_managed', 'full_ownership']:
        recommendations.extend(['maintenance_support', 'seo_optimization'])
    
    return list(set(recommendations))  # Remove duplicates


def format_submission_summary(submission):
    """
    Format submission data for email templates.
    """
    services_display = []
    service_map = {
        'web_design_development': 'Web Design & Development',
        'ecommerce_solutions': 'E-commerce Solutions',
        'seo_optimization': 'SEO Optimization',
        'ui_ux_design': 'UI/UX Design',
        'maintenance_support': 'Maintenance & Support',
        'content_creation': 'Content Creation',
    }
    
    for service in submission.services_needed:
        services_display.append(service_map.get(service, service.replace('_', ' ').title()))
    
    budget_display = {
        'pay_as_you_go': 'Pay-As-You-Go (£59/month)',
        'fully_managed': 'Fully Managed (£249/month)',
        'full_ownership': 'Full Ownership (Custom pricing)',
        'custom': 'Custom Budget',
    }.get(submission.budget_range, submission.budget_range)
    
    timeline_display = {
        'flexible': 'Flexible timeline',
        'urgent': 'Urgent (ASAP)',
        'specific': f'Specific date: {submission.target_date}' if submission.target_date else 'Specific date',
    }.get(submission.timeline, submission.timeline)
    
    return {
        'reference_number': submission.reference_number,
        'business_name': submission.business_name,
        'contact_name': submission.contact_name,
        'email': submission.email,
        'phone': submission.phone or 'Not provided',
        'industry': submission.industry.replace('_', ' ').title(),
        'website_type': submission.website_type.replace('_', ' ').title(),
        'current_website': submission.current_website or 'None',
        'services_needed': ', '.join(services_display),
        'budget_range': budget_display,
        'timeline': timeline_display,
        'additional_requirements': submission.additional_requirements or 'None specified',
        'preferred_contact': submission.get_preferred_contact_display(),
        'best_time_to_reach': submission.get_best_time_to_reach_display(),
        'estimated_value': f"£{submission.estimated_value:,.2f}",
        'created_at': submission.created_at.strftime('%B %d, %Y at %I:%M %p'),
    }


def get_submission_priority(submission):
    """
    Calculate submission priority based on various factors.
    """
    priority_score = 0
    
    # Budget-based priority
    budget_scores = {
        'full_ownership': 3,
        'fully_managed': 2,
        'pay_as_you_go': 1,
        'custom': 2,
    }
    priority_score += budget_scores.get(submission.budget_range, 1)
    
    # Timeline urgency
    if submission.timeline == 'urgent':
        priority_score += 2
    elif submission.timeline == 'specific' and submission.target_date:
        from django.utils import timezone
        days_until = (submission.target_date - timezone.now().date()).days
        if days_until <= 30:
            priority_score += 2
        elif days_until <= 60:
            priority_score += 1
    
    # Service complexity
    complex_services = ['ecommerce_solutions', 'ui_ux_design', 'content_creation']
    if any(service in submission.services_needed for service in complex_services):
        priority_score += 1
    
    # Determine priority level
    if priority_score >= 5:
        return 'urgent'
    elif priority_score >= 3:
        return 'high'
    elif priority_score >= 2:
        return 'medium'
    else:
        return 'low'