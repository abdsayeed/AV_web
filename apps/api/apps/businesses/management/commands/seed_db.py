from django.core.management.base import BaseCommand
from django.db import transaction


INDUSTRIES = [
    {"slug": "barbershop", "label": "Barbershops", "icon_name": "content_cut"},
    {"slug": "restaurant", "label": "Cafes & Dining", "icon_name": "restaurant"},
    {"slug": "salon", "label": "Salon / Beauty", "icon_name": "spa"},
    {"slug": "retail", "label": "Boutique Retail", "icon_name": "storefront"},
    {"slug": "trades", "label": "Home Services", "icon_name": "home_repair_service"},
    {"slug": "other", "label": "Professional", "icon_name": "business_center"},
]

TEMPLATES = [
    {
        "slug": "aries-grooming",
        "name": "Aries Grooming",
        "industry_slug": "barbershop",
        "description": "A modern barber shop template offering professional haircuts and grooming services. Clean environment, skilled barbers, precision and style.",
        "preview_image_url": "assets/templates/aries_grooming.png",
        "demo_url": "https://arfahad99.github.io/AVT1_BarberShop/",
        "badge": "popular",
        "is_featured": True,
        "sort_order": 1,
        "features": ["Online booking", "Service menu", "Gallery", "Google Maps", "Mobile-first"],
    },
    {
        "slug": "avt-restaurant-1",
        "name": "AVT Restaurant",
        "industry_slug": "restaurant",
        "description": "A welcoming dining experience with fresh ingredients and well-prepared dishes. Comfortable setting, consistent service.",
        "preview_image_url": "assets/templates/avt_restaurant.png",
        "demo_url": "https://abdsayeed.github.io/AVT1-Restaurant/",
        "badge": "popular",
        "is_featured": True,
        "sort_order": 2,
        "features": ["Online menu", "Table booking", "Gallery", "Contact form", "Mobile-first"],
    },
    {
        "slug": "aries-ventures-barber",
        "name": "Aries Ventures Barber",
        "industry_slug": "barbershop",
        "description": "High-end grooming destination with expert haircuts and premium barbering. Refined experience, modern techniques.",
        "preview_image_url": "assets/templates/aries_ventures_barber.png",
        "demo_url": "https://arfahad99.github.io/AVT2_BarberShop/",
        "badge": "popular",
        "is_featured": True,
        "sort_order": 3,
        "features": ["Booking system", "Price list", "Team profiles", "Gallery", "SEO-ready"],
    },
    {
        "slug": "avt-restaurant-2",
        "name": "AVT Restaurant 2",
        "industry_slug": "restaurant",
        "description": "Traditional cuisine with a strong focus on hygiene and cleanliness. Authentic flavors, welcoming setting.",
        "preview_image_url": "assets/templates/avt_restaurant2.png",
        "demo_url": "https://abdsayeed.github.io/AVT2/",
        "badge": "high_conversion",
        "is_featured": False,
        "sort_order": 4,
        "features": ["Digital menu", "Order form", "Location map", "Reviews section", "Fast loading"],
    },
    {
        "slug": "avt-restaurant-3",
        "name": "AVT Restaurant 3",
        "industry_slug": "restaurant",
        "description": "Authentic Newari restaurant with traditional dishes rich in flavor and heritage. Warm, genuine cultural dining experience.",
        "preview_image_url": "assets/templates/avt_restaurant3.png",
        "demo_url": "https://abdsayeed.github.io/AVT3/",
        "badge": None,
        "is_featured": False,
        "sort_order": 5,
        "features": ["Cultural menu", "Story section", "Photo gallery", "Reservation form", "Mobile-first"],
    },
    {
        "slug": "avt-restaurant-4",
        "name": "AVT Restaurant 4",
        "industry_slug": "restaurant",
        "description": "Exquisite dining with refined flavors and elegant presentation. Sophisticated ambiance, perfect for special occasions.",
        "preview_image_url": "assets/templates/avt_restaurant4.png",
        "demo_url": "https://abdsayeed.github.io/AVT4/",
        "badge": "popular",
        "is_featured": False,
        "sort_order": 6,
        "features": ["Fine dining menu", "Private events", "Wine list", "Booking system", "SEO-ready"],
    },
    {
        "slug": "av-saloon",
        "name": "AV Saloon",
        "industry_slug": "salon",
        "description": "Professional hair and beauty services tailored to enhance personal style. Experienced stylists, quality care, modern setting.",
        "preview_image_url": "assets/templates/aries_grooming2.png",
        "demo_url": "https://arfahad99.github.io/AVT3_Salon-master/",
        "badge": "popular",
        "is_featured": True,
        "sort_order": 7,
        "features": ["Service menu", "Online booking", "Team profiles", "Gallery", "Gift vouchers"],
    },
]

PRICING_PLANS = [
    {
        "slug": "pay-as-you-go",
        "name": "Pay-As-You-Go Website",
        "tier": "basic",
        "price_pence": 5900,  # £59/mo
        "billing_period": "monthly",
        "is_popular": False,
        "sort_order": 1,
        "features": [
            {"text": "5-page responsive website", "highlighted": False},
            {"text": "Template-based design", "highlighted": False},
            {"text": "Contact form & Google Maps", "highlighted": False},
            {"text": "Basic SEO setup", "highlighted": False},
            {"text": "Hosting, SSL & backups", "highlighted": True},
            {"text": "Regular security updates", "highlighted": False},
            {"text": "Small content changes", "highlighted": False},
            {"text": "Performance monitoring", "highlighted": False},
        ],
    },
    {
        "slug": "fully-managed",
        "name": "Fully Managed Professional Website",
        "tier": "pro",
        "price_pence": 24900,  # £249/mo
        "billing_period": "monthly",
        "is_popular": True,
        "sort_order": 2,
        "features": [
            {"text": "Up to 12–15 pages", "highlighted": False},
            {"text": "Custom brand-aligned design", "highlighted": True},
            {"text": "Mobile-first & fully responsive", "highlighted": False},
            {"text": "Advanced forms (quotes, bookings)", "highlighted": False},
            {"text": "Blog / CMS included", "highlighted": False},
            {"text": "Advanced SEO & analytics", "highlighted": True},
            {"text": "Premium hosting & CDN", "highlighted": False},
            {"text": "Daily backups & security", "highlighted": False},
            {"text": "Unlimited content updates", "highlighted": True},
            {"text": "Monthly reports", "highlighted": False},
            {"text": "Priority support", "highlighted": False},
        ],
    },
    {
        "slug": "full-professional",
        "name": "Full Professional Website",
        "tier": "custom",
        "price_pence": 0,  # Custom pricing
        "billing_period": "one_time",
        "is_popular": False,
        "sort_order": 3,
        "features": [
            {"text": "Fully custom design", "highlighted": True},
            {"text": "Unlimited pages & features", "highlighted": False},
            {"text": "Custom UI/UX design", "highlighted": False},
            {"text": "Advanced integrations", "highlighted": False},
            {"text": "Blog / CMS", "highlighted": False},
            {"text": "SEO-ready structure", "highlighted": False},
            {"text": "Speed optimized", "highlighted": False},
            {"text": "Full source code included", "highlighted": True},
            {"text": "You own the website", "highlighted": True},
            {"text": "Optional maintenance plan", "highlighted": False},
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the database with industries, templates, and pricing plans"

    @transaction.atomic
    def handle(self, *args, **options):
        from apps.businesses.models import Industry
        from apps.templates_app.models import Template, TemplateFeature
        from apps.pricing.models import PricingPlan, PlanFeature

        self.stdout.write("Seeding industries...")
        industry_map = {}
        for data in INDUSTRIES:
            obj, created = Industry.objects.update_or_create(
                slug=data["slug"],
                defaults={"label": data["label"], "icon_name": data["icon_name"]},
            )
            industry_map[data["slug"]] = obj
            self.stdout.write(f"  {'Created' if created else 'Updated'} industry: {obj.label}")

        self.stdout.write("Seeding templates...")
        for data in TEMPLATES:
            industry = industry_map.get(data["industry_slug"])
            template, created = Template.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "name": data["name"],
                    "industry": industry,
                    "description": data["description"],
                    "preview_image_url": data["preview_image_url"],
                    "demo_url": data["demo_url"],
                    "badge": data["badge"],
                    "is_featured": data["is_featured"],
                    "is_active": True,
                    "sort_order": data["sort_order"],
                },
            )
            # Recreate features
            template.features.all().delete()
            for i, feat in enumerate(data["features"]):
                TemplateFeature.objects.create(template=template, feature_text=feat, sort_order=i)
            self.stdout.write(f"  {'Created' if created else 'Updated'} template: {template.name}")

        self.stdout.write("Seeding pricing plans...")
        for data in PRICING_PLANS:
            plan, created = PricingPlan.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "name": data["name"],
                    "tier": data["tier"],
                    "price_pence": data["price_pence"],
                    "billing_period": data["billing_period"],
                    "is_popular": data["is_popular"],
                    "is_active": True,
                    "sort_order": data["sort_order"],
                },
            )
            plan.features.all().delete()
            for i, feat in enumerate(data["features"]):
                PlanFeature.objects.create(
                    plan=plan,
                    feature_text=feat["text"],
                    is_highlighted=feat["highlighted"],
                    sort_order=i,
                )
            self.stdout.write(f"  {'Created' if created else 'Updated'} plan: {plan.name}")

        self.stdout.write(self.style.SUCCESS("Database seeded successfully."))
