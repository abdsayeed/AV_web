from django.urls import path
from .views import ContactSubmitView, ContactLookupView

urlpatterns = [
    path("contact/submit/", ContactSubmitView.as_view(), name="contact-submit"),
    path("contact/lookup/", ContactLookupView.as_view(), name="contact-lookup"),
]
