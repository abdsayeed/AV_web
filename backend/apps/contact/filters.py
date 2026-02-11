"""
Filters for Contact app.
"""
import django_filters
from django.db.models import Q
from .models import ContactSubmission


class ContactSubmissionFilter(django_filters.FilterSet):
    """
    Filter for contact submissions.
    """
    status = django_filters.MultipleChoiceFilter(
        choices=ContactSubmission.STATUS_CHOICES,
        field_name='status',
        lookup_expr='in'
    )
    
    priority = django_filters.MultipleChoiceFilter(
        choices=ContactSubmission.PRIORITY_CHOICES,
        field_name='priority',
        lookup_expr='in'
    )
    
    source = django_filters.MultipleChoiceFilter(
        choices=ContactSubmission.SOURCE_CHOICES,
        field_name='source',
        lookup_expr='in'
    )
    
    budget_range = django_filters.MultipleChoiceFilter(
        choices=ContactSubmission.BUDGET_CHOICES,
        field_name='budget_range',
        lookup_expr='in'
    )
    
    assigned_to = django_filters.NumberFilter(
        field_name='assigned_to',
        lookup_expr='exact'
    )
    
    unassigned = django_filters.BooleanFilter(
        method='filter_unassigned'
    )
    
    overdue = django_filters.BooleanFilter(
        method='filter_overdue'
    )
    
    created_after = django_filters.DateTimeFilter(
        field_name='created_at',
        lookup_expr='gte'
    )
    
    created_before = django_filters.DateTimeFilter(
        field_name='created_at',
        lookup_expr='lte'
    )
    
    industry = django_filters.CharFilter(
        field_name='industry',
        lookup_expr='icontains'
    )
    
    business_name = django_filters.CharFilter(
        field_name='business_name',
        lookup_expr='icontains'
    )
    
    email = django_filters.CharFilter(
        field_name='email',
        lookup_expr='icontains'
    )

    class Meta:
        model = ContactSubmission
        fields = [
            'status', 'priority', 'source', 'budget_range', 'assigned_to',
            'unassigned', 'overdue', 'created_after', 'created_before',
            'industry', 'business_name', 'email'
        ]

    def filter_unassigned(self, queryset, name, value):
        """Filter for unassigned submissions."""
        if value:
            return queryset.filter(assigned_to__isnull=True)
        return queryset

    def filter_overdue(self, queryset, name, value):
        """Filter for overdue submissions."""
        if value:
            from django.utils import timezone
            cutoff = timezone.now() - timezone.timedelta(hours=24)
            return queryset.filter(
                status='new',
                first_response_at__isnull=True,
                created_at__lt=cutoff
            )
        return queryset