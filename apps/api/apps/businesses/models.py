import uuid
from django.db import models
from apps.authentication.models import User


class Industry(models.Model):
    class Slug(models.TextChoices):
        BARBERSHOP = "barbershop", "Barbershop"
        RESTAURANT = "restaurant", "Restaurant / Café"
        SALON = "salon", "Salon / Beauty"
        RETAIL = "retail", "Retail / Shop"
        TRADES = "trades", "Trades / Services"
        OTHER = "other", "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True)
    label = models.CharField(max_length=100)
    icon_name = models.CharField(max_length=100)

    class Meta:
        db_table = "industries"
        ordering = ["label"]

    def __str__(self):
        return self.label


class Business(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="business", db_index=True)
    name = models.CharField(max_length=255)
    industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    phone = models.CharField(max_length=30, blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    postcode = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default="United Kingdom")
    website_url = models.URLField(blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "businesses"
        indexes = [models.Index(fields=["user"]), models.Index(fields=["industry"])]

    def __str__(self):
        return self.name
