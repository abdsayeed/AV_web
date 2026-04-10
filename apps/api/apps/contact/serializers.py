from rest_framework import serializers
from .models import ContactSubmission, SubmissionService
from apps.businesses.models import Industry
from apps.pricing.models import PricingPlan


class SubmissionServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionService
        fields = ["service"]


class ContactSubmissionSerializer(serializers.ModelSerializer):
    services = SubmissionServiceSerializer(many=True, read_only=True)
    industry_label = serializers.CharField(source="industry.label", read_only=True)
    plan_name = serializers.CharField(source="budget_tier.name", read_only=True)

    class Meta:
        model = ContactSubmission
        fields = [
            "id", "reference_number", "business_name", "industry", "industry_label",
            "website_type", "budget_tier", "plan_name", "contact_name", "email",
            "phone", "message", "status", "services", "created_at",
        ]
        read_only_fields = ["id", "reference_number", "status", "created_at"]


class ContactSubmissionCreateSerializer(serializers.Serializer):
    business_name = serializers.CharField(min_length=2, max_length=100)
    industry_slug = serializers.SlugField(required=False, allow_blank=True)
    website_type = serializers.ChoiceField(choices=ContactSubmission.WebsiteType.choices)
    plan_slug = serializers.SlugField(required=False, allow_blank=True)
    services = serializers.ListField(
        child=serializers.ChoiceField(choices=SubmissionService.Service.choices),
        required=False,
        default=list,
    )
    contact_name = serializers.CharField(min_length=2, max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    message = serializers.CharField(min_length=20, max_length=1000)

    def create(self, validated_data):
        services = validated_data.pop("services", [])
        industry_slug = validated_data.pop("industry_slug", None)
        plan_slug = validated_data.pop("plan_slug", None)

        industry = None
        if industry_slug:
            industry = Industry.objects.filter(slug=industry_slug).first()

        budget_tier = None
        if plan_slug:
            budget_tier = PricingPlan.objects.filter(slug=plan_slug).first()

        submission = ContactSubmission.objects.create(
            industry=industry,
            budget_tier=budget_tier,
            **validated_data,
        )

        for service in services:
            SubmissionService.objects.create(submission=submission, service=service)

        return submission
