"""
URL configuration for Contact app.
"""
from django.urls import path
from . import views

app_name = 'contact'

urlpatterns = [
    # Public endpoints
    path('submit/', views.ContactSubmissionCreateView.as_view(), name='submit'),
    path('lookup/', views.submission_lookup, name='lookup'),
    path('analytics/', views.ContactFormAnalyticsView.as_view(), name='analytics'),
    
    # Admin endpoints
    path('submissions/', views.ContactSubmissionListView.as_view(), name='submission_list'),
    path('submissions/<uuid:pk>/', views.ContactSubmissionDetailView.as_view(), name='submission_detail'),
    path('submissions/<uuid:submission_id>/notes/', views.SubmissionNotesView.as_view(), name='submission_notes'),
    path('submissions/<uuid:submission_id>/attachments/', views.SubmissionAttachmentsView.as_view(), name='submission_attachments'),
    
    # Bulk operations
    path('bulk-update/', views.bulk_update_submissions, name='bulk_update'),
    
    # Statistics and reports
    path('stats/', views.submission_stats, name='stats'),
    path('my-assignments/', views.my_assignments, name='my_assignments'),
]