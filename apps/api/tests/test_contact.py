import pytest
from rest_framework.test import APIClient
from apps.authentication.models import User
from apps.businesses.models import Industry
from apps.pricing.models import PricingPlan


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def industry(db):
    return Industry.objects.create(slug="barbershop", label="Barbershop", icon_name="content_cut")


@pytest.fixture
def plan(db):
    return PricingPlan.objects.create(
        slug="pay-as-you-go", name="Pay-As-You-Go", tier="basic",
        price_pence=5900, billing_period="monthly",
    )


@pytest.mark.django_db
class TestContactSubmit:
    def test_submit_success(self, client, industry, plan):
        res = client.post("/api/contact/submit/", {
            "business_name": "Test Barber",
            "industry_slug": "barbershop",
            "website_type": "new",
            "plan_slug": "pay-as-you-go",
            "services": ["seo", "design"],
            "contact_name": "John Smith",
            "email": "john@testbarber.com",
            "phone": "+447700000000",
            "message": "We need a new website for our barbershop in London.",
        })
        assert res.status_code == 201
        assert "reference_number" in res.data
        assert res.data["reference_number"].startswith("AV-")

    def test_submit_missing_required(self, client):
        res = client.post("/api/contact/submit/", {
            "business_name": "Test",
        })
        assert res.status_code == 400

    def test_submit_message_too_short(self, client, industry, plan):
        res = client.post("/api/contact/submit/", {
            "business_name": "Test Barber",
            "website_type": "new",
            "contact_name": "John",
            "email": "john@test.com",
            "message": "Too short",
        })
        assert res.status_code == 400

    def test_lookup_by_reference(self, client, industry, plan):
        submit_res = client.post("/api/contact/submit/", {
            "business_name": "Lookup Test",
            "website_type": "new",
            "contact_name": "Jane",
            "email": "jane@test.com",
            "message": "This is a test message that is long enough to pass validation.",
        })
        ref = submit_res.data["reference_number"]
        lookup_res = client.get(f"/api/contact/lookup/?ref={ref}")
        assert lookup_res.status_code == 200
        assert lookup_res.data["reference_number"] == ref
