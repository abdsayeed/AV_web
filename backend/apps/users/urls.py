"""
URL configuration for Users app.
"""
from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    # Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    # Profile
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # Password Reset
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # Email Verification
    path('verify-email/', views.EmailVerificationView.as_view(), name='verify_email'),
    path('resend-verification/', views.ResendVerificationView.as_view(), name='resend_verification'),
    
    # Admin endpoints
    path('list/', views.UserListView.as_view(), name='user_list'),
    path('activities/', views.UserActivityListView.as_view(), name='user_activities'),
    path('stats/', views.user_stats, name='user_stats'),
]