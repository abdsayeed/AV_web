import pytest
from rest_framework.test import APIClient
from apps.businesses.models import Industry
from apps.templates_app.models import Template
from apps.pricing.models import PricingPlan


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def seed_data(db):
    ind = Industry.objects.create(slug="barbershop", label="Barbershop", icon_name="content_cut")
    t = Template.objects.create(
        slug="aries-grooming", name="Aries Grooming", industry=ind,
        description="A barber template", preview_image_url="http://example.com/img.png",
        demo_url="https://arfahad99.github.io/AVT1_BarberShop/",
        badge="popular", is_active=True, sort_order=1,
    )
    p = PricingPlan.objects.create(
        slug="pay-as-you-go", name="Pay-As-You-Go", tier="basic",
        price_pence=5900, billing_period="monthly", is_active=True,
    )
    return {"industry": ind, "template": t, "plan": p}


@pytest.mark.django_db
class TestPublicEndpoints:
    def test_industries_list(self, client, seed_data):
        res = client.get("/api/industries/")
        assert res.status_code == 200
        assert len(res.data) == 1
        assert res.data[0]["slug"] == "barbershop"

    def test_templates_list(self, client, seed_data):
        res = client.get("/api/templates/")
        assert res.status_code == 200
        assert len(res.data) == 1
        assert res.data[0]["slug"] == "aries-grooming"

    def test_template_detail(self, client, seed_data):
        res = client.get("/api/templates/aries-grooming/")
        assert res.status_code == 200
        assert res.data["name"] == "Aries Grooming"

    def test_template_detail_not_found(self, client, seed_data):
        res = client.get("/api/templates/nonexistent/")
        assert res.status_code == 404

    def test_pricing_list(self, client, seed_data):
        res = client.get("/api/pricing/plans/")
        assert res.status_code == 200
        assert len(res.data) == 1
        assert res.data[0]["price_pence"] == 5900

    def test_health_check(self, client):
        res = client.get("/api/health/")
        assert res.status_code == 200
        assert res.data["status"] in ("ok", "degraded")
