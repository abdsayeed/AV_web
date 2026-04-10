import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.authentication.models import User


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="test@example.com",
        name="Test User",
        password="TestPass123",
    )


@pytest.mark.django_db
class TestRegister:
    def test_register_success(self, client):
        res = client.post("/api/auth/register/", {
            "name": "New User",
            "email": "new@example.com",
            "password": "NewPass123",
            "confirm_password": "NewPass123",
        })
        assert res.status_code == 201
        assert "access" in res.data
        assert res.data["user"]["email"] == "new@example.com"

    def test_register_duplicate_email(self, client, user):
        res = client.post("/api/auth/register/", {
            "name": "Dup",
            "email": "test@example.com",
            "password": "TestPass123",
            "confirm_password": "TestPass123",
        })
        assert res.status_code == 400

    def test_register_weak_password(self, client):
        res = client.post("/api/auth/register/", {
            "name": "Weak",
            "email": "weak@example.com",
            "password": "password",
            "confirm_password": "password",
        })
        assert res.status_code == 400

    def test_register_password_mismatch(self, client):
        res = client.post("/api/auth/register/", {
            "name": "Mismatch",
            "email": "mismatch@example.com",
            "password": "TestPass123",
            "confirm_password": "Different123",
        })
        assert res.status_code == 400


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, client, user):
        res = client.post("/api/auth/login/", {
            "email": "test@example.com",
            "password": "TestPass123",
        })
        assert res.status_code == 200
        assert "access" in res.data

    def test_login_wrong_password(self, client, user):
        res = client.post("/api/auth/login/", {
            "email": "test@example.com",
            "password": "WrongPass",
        })
        assert res.status_code == 401

    def test_login_nonexistent_user(self, client):
        res = client.post("/api/auth/login/", {
            "email": "nobody@example.com",
            "password": "TestPass123",
        })
        assert res.status_code == 401


@pytest.mark.django_db
class TestProfile:
    def test_get_profile_authenticated(self, client, user):
        client.force_authenticate(user=user)
        res = client.get("/api/auth/profile/")
        assert res.status_code == 200
        assert res.data["email"] == user.email

    def test_get_profile_unauthenticated(self, client):
        res = client.get("/api/auth/profile/")
        assert res.status_code == 401

    def test_patch_profile(self, client, user):
        client.force_authenticate(user=user)
        res = client.patch("/api/auth/profile/", {"name": "Updated Name"})
        assert res.status_code == 200
        assert res.data["name"] == "Updated Name"


@pytest.mark.django_db
class TestForgotPassword:
    def test_forgot_password_always_200(self, client):
        # Should return 200 even for non-existent email (prevent enumeration)
        res = client.post("/api/auth/forgot-password/", {"email": "nobody@example.com"})
        assert res.status_code == 200

    def test_forgot_password_valid_email(self, client, user):
        res = client.post("/api/auth/forgot-password/", {"email": user.email})
        assert res.status_code == 200
