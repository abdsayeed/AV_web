"""
Custom managers for User model.
"""
from django.contrib.auth.models import BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    """
    Custom user manager for email-based authentication.
    """

    def create_user(self, email, name, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        if not name:
            raise ValueError('The Name field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, name, password, **extra_fields)

    def get_by_natural_key(self, username):
        """
        Allow authentication with case-insensitive email.
        """
        return self.get(email__iexact=username)

    def active(self):
        """
        Return only active users.
        """
        return self.filter(is_active=True)

    def verified(self):
        """
        Return only verified users.
        """
        return self.filter(is_verified=True)

    def customers(self):
        """
        Return only customer users.
        """
        return self.filter(role='customer')

    def admins(self):
        """
        Return only admin users.
        """
        return self.filter(role='admin')

    def recent(self, days=30):
        """
        Return users created in the last N days.
        """
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        return self.filter(created_at__gte=cutoff_date)