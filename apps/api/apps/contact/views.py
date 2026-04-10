from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.rate_limit import rate_limit
from core.email import send_email_async
from .models import ContactSubmission, SubmissionService
from .serializers import ContactSubmissionSerializer, ContactSubmissionCreateSerializer


class ContactSubmitView(APIView):
    permission_classes = [AllowAny]

    @rate_limit(key="contact_submit", limit=3, window=3600)
    def post(self, request):
        serializer = ContactSubmissionCreateSerializer(
            data=request.data,
            context={"request": request},
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            submission = serializer.save(
                user=request.user if request.user.is_authenticated else None
            )

        # Fire async emails via Trigger.dev
        send_email_async("contact_confirmation", submission.email, {
            "name": submission.contact_name,
            "reference": submission.reference_number,
            "business_name": submission.business_name,
        })
        team_email = __import__("os").environ.get("RESEND_TEAM_EMAIL", "team@aris-ventures.com")
        send_email_async("internal_lead_alert", team_email, {
            "submission": ContactSubmissionSerializer(submission).data,
            "admin_url": f"/admin/contact/{submission.id}/",
        })

        return Response(
            {"reference_number": submission.reference_number},
            status=status.HTTP_201_CREATED,
        )


class ContactLookupView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        ref = request.query_params.get("ref")
        if not ref:
            return Response({"detail": "ref query param required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            submission = ContactSubmission.objects.get(reference_number=ref)
        except ContactSubmission.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(ContactSubmissionSerializer(submission).data)
