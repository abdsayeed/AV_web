import hashlib
import hmac
import secrets
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

from .models import User, PasswordResetToken, EmailVerificationToken
from .serializers import (
    RegisterSerializer, UserSerializer, ChangePasswordSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer,
)
from core.rate_limit import rate_limit
from core.email import send_email_async


def _hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode()).hexdigest()


def _blacklist_all_user_tokens(user: User):
    """Blacklist all outstanding refresh tokens for a user."""
    tokens = OutstandingToken.objects.filter(user=user)
    for token in tokens:
        BlacklistedToken.objects.get_or_create(token=token)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @rate_limit(key="register", limit=10, window=3600)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        # Send verification email
        raw_token = secrets.token_urlsafe(32)
        EmailVerificationToken.objects.create(
            user=user,
            token_hash=_hash_token(raw_token),
            expires_at=timezone.now() + timedelta(hours=24),
        )
        verify_url = f"{settings.FRONTEND_URL}/verify-email?token={raw_token}"
        send_email_async("welcome", user.email, {"name": user.name, "verify_url": verify_url})

        # Issue tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        raw_token = request.query_params.get("token")
        if not raw_token:
            return Response({"detail": "Token required."}, status=status.HTTP_400_BAD_REQUEST)

        token_hash = _hash_token(raw_token)
        try:
            token_obj = EmailVerificationToken.objects.select_related("user").get(token_hash=token_hash)
        except EmailVerificationToken.DoesNotExist:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        if not token_obj.is_valid:
            return Response({"detail": "Token expired or already used."}, status=status.HTTP_400_BAD_REQUEST)

        token_obj.user.is_verified = True
        token_obj.user.save(update_fields=["is_verified"])
        token_obj.used_at = timezone.now()
        token_obj.save(update_fields=["used_at"])

        return Response({"detail": "Email verified successfully."})


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    @rate_limit(key="forgot_password", limit=3, window=3600)
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        # Always return 200 to prevent email enumeration
        try:
            user = User.objects.get(email=email, is_active=True)
            raw_token = secrets.token_urlsafe(32)
            PasswordResetToken.objects.create(
                user=user,
                token_hash=_hash_token(raw_token),
                expires_at=timezone.now() + timedelta(hours=1),
            )
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={raw_token}"
            send_email_async("password_reset", user.email, {"name": user.name, "reset_url": reset_url})
        except User.DoesNotExist:
            pass

        return Response({"detail": "If that email exists, a reset link has been sent."})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token_hash = _hash_token(serializer.validated_data["token"])
        try:
            token_obj = PasswordResetToken.objects.select_related("user").get(token_hash=token_hash)
        except PasswordResetToken.DoesNotExist:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        if not token_obj.is_valid:
            return Response({"detail": "Token expired or already used."}, status=status.HTTP_400_BAD_REQUEST)

        user = token_obj.user
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])

        token_obj.used_at = timezone.now()
        token_obj.save(update_fields=["used_at"])

        _blacklist_all_user_tokens(user)

        return Response({"detail": "Password reset successfully."})


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if not user.check_password(serializer.validated_data["current_password"]):
            return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])

        return Response({"detail": "Password changed successfully."})


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)
