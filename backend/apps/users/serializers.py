"""
Serializers for User app.
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, UserActivity


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = [
            'email', 'name', 'business_name', 'password', 'confirm_password',
            'phone', 'website', 'marketing_emails'
        ]

    def validate(self, attrs):
        """
        Validate password confirmation.
        """
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs

    def validate_email(self, value):
        """
        Validate email uniqueness.
        """
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        """
        Create a new user.
        """
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        
        # Generate verification token
        user.generate_verification_token()
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        """
        Validate user credentials.
        """
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )

            if not user:
                raise serializers.ValidationError(
                    'Invalid email or password.',
                    code='authorization'
                )

            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is disabled.',
                    code='authorization'
                )

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                'Must include "email" and "password".',
                code='authorization'
            )


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile.
    """
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'business_name', 'phone', 'avatar',
            'bio', 'website', 'role', 'is_verified', 'email_notifications',
            'marketing_emails', 'created_at', 'last_login'
        ]
        read_only_fields = ['id', 'email', 'role', 'is_verified', 'created_at', 'last_login']


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    """
    class Meta:
        model = User
        fields = [
            'name', 'business_name', 'phone', 'avatar', 'bio', 'website',
            'email_notifications', 'marketing_emails'
        ]

    def validate_phone(self, value):
        """
        Validate phone number format.
        """
        if value and not value.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise serializers.ValidationError("Invalid phone number format.")
        return value


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for changing password.
    """
    current_password = serializers.CharField(style={'input_type': 'password'})
    new_password = serializers.CharField(
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(style={'input_type': 'password'})

    def validate_current_password(self, value):
        """
        Validate current password.
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, attrs):
        """
        Validate password confirmation.
        """
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("New passwords don't match.")
        return attrs

    def save(self):
        """
        Update user password.
        """
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for password reset request.
    """
    email = serializers.EmailField()

    def validate_email(self, value):
        """
        Validate email exists.
        """
        try:
            user = User.objects.get(email__iexact=value)
            self.user = user
        except User.DoesNotExist:
            # Don't reveal if email exists or not for security
            pass
        return value.lower()


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for password reset confirmation.
    """
    token = serializers.CharField()
    new_password = serializers.CharField(
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        """
        Validate token and password confirmation.
        """
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")
        
        # Validate token
        try:
            from django.utils import timezone
            user = User.objects.get(
                password_reset_token=attrs['token'],
                password_reset_expires__gt=timezone.now()
            )
            attrs['user'] = user
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired token.")
        
        return attrs

    def save(self):
        """
        Reset user password.
        """
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.clear_password_reset_token()
        return user


class EmailVerificationSerializer(serializers.Serializer):
    """
    Serializer for email verification.
    """
    token = serializers.CharField()

    def validate_token(self, value):
        """
        Validate verification token.
        """
        try:
            from django.utils import timezone
            user = User.objects.get(
                verification_token=value,
                verification_token_expires__gt=timezone.now()
            )
            self.user = user
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired verification token.")
        return value

    def save(self):
        """
        Verify user email.
        """
        self.user.verify_email()
        return self.user


class UserActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for user activities.
    """
    user_email = serializers.CharField(source='user.email', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = UserActivity
        fields = [
            'id', 'user_email', 'action', 'action_display', 'description',
            'ip_address', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer for user list (admin view).
    """
    display_name = serializers.CharField(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'display_name', 'business_name',
            'role', 'role_display', 'is_active', 'is_verified',
            'created_at', 'last_login', 'login_count'
        ]