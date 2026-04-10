from rest_framework import serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.cache import cache
from .models import Industry, Business


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ["id", "slug", "label", "icon_name"]


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ["id", "name", "industry", "phone", "address_line1", "address_line2",
                  "city", "postcode", "country", "website_url", "logo_url", "description"]


class IndustryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        cached = cache.get("industries_list")
        if cached:
            return Response(cached)
        data = IndustrySerializer(Industry.objects.all(), many=True).data
        cache.set("industries_list", data, timeout=3600)
        return Response(data)


class BusinessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            biz = request.user.business
            return Response(BusinessSerializer(biz).data)
        except Business.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        try:
            biz = request.user.business
            serializer = BusinessSerializer(biz, data=request.data, partial=True)
        except Business.DoesNotExist:
            serializer = BusinessSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(user=request.user)
        return Response(serializer.data)
