"""
Utility functions for Users app.
"""
from .models import UserActivity


def get_client_ip(request):
    """
    Get client IP address from request.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent(request):
    """
    Get user agent from request.
    """
    return request.META.get('HTTP_USER_AGENT', '')


def log_user_activity(user, action, description='', request=None, metadata=None):
    """
    Log user activity.
    """
    activity_data = {
        'user': user,
        'action': action,
        'description': description,
        'metadata': metadata or {}
    }
    
    if request:
        activity_data.update({
            'ip_address': get_client_ip(request),
            'user_agent': get_user_agent(request)
        })
    
    return UserActivity.objects.create(**activity_data)