import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { TemplatesGalleryComponent } from '../../shared/components/templates-gallery/templates-gallery.component';
import { PricingCardsComponent } from '../../shared/components/pricing-cards/pricing-cards.component';
import { ContactCtaComponent } from '../../shared/components/contact-cta/contact-cta.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { TrustBadgesComponent } from '../../shared/components/trust-badges/trust-badges.component';
import { ContextService } from '../../core/services/context.service';
import { MicroInteractionsDirective } from '../../shared/directives/micro-interactions.directive';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    CommonModule, 
    NavComponent, 
    TemplatesGalleryComponent, 
    PricingCardsComponent, 
    ContactCtaComponent, 
    FooterComponent,
    TrustBadgesComponent,
    MicroInteractionsDirective
  ],
  template: `
    <!-- ═══════════════════════════════════════════════════════════
         TEMPLATES STANDALONE PAGE
    ═══════════════════════════════════════════════════════════ -->
    <main class="relative overflow-hidden bg-surface text-on-surface font-body">
      
      <app-nav 
        [navItems]="navItems" 
        [activeSection]="''" 
        (linkClick)="handleNavigation($event)">
      </app-nav>

      <!-- ── CUSTOM HERO FOR TEMPLATES ── -->
      <section class="scroll-section relative pt-40 pb-20 grid-overlay overflow-hidden bg-surface-container-low">
        <!-- Ambient blobs -->
        <div class="absolute inset-0 pointer-events-none z-0">
          <div class="absolute top-0 -left-[10%] w-[40%] h-[60%] rounded-full bg-secondary-fixed/20 blur-[120px]"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-8 text-center cinematic-reveal">
          <span class="text-secondary font-bold font-label tracking-widest text-sm uppercase">The Collection</span>
          <h1 class="text-6xl md:text-7xl font-extrabold leading-tight tracking-tighter font-headline text-on-surface mt-4 mb-6">
            Masterpieces<br>in every pixel.
          </h1>
          <p class="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-10">
            Our templates are bespoke foundations — designed to be extended and evolved with your brand. Choose a foundation, and let's start building your digital future.
          </p>
        </div>
      </section>

      <!-- ── TEMPLATES GALLERY ── -->
      <app-templates-gallery 
        [templates]="templates" 
        [showTitle]="false"
        [alternateBg]="true"
        [showLoadMore]="false"
        useTemplateLabel="Use this template — start your project today"
        (useTemplate)="useTemplate($event)" 
        (viewLiveDemo)="viewLiveDemo($event)">
      </app-templates-gallery>

      <!-- ── PRICING ── -->
      <app-pricing-cards 
        [pricingPlans]="pricingPlans" 
        (planSelect)="selectPlan($event)">
      </app-pricing-cards>

      <!-- ── CONTACT CTA ── -->
      <app-contact-cta (ctaClick)="goToContactForm()"></app-contact-cta>

      <!-- ── TRUST BADGES ── -->
      <app-trust-badges class="block"></app-trust-badges>

      <!-- ── FOOTER ── -->
      <app-footer 
        (linkClick)="handleNavigation($event)" 
        (contactClick)="goToContactForm()">
      </app-footer>

    </main>
  `
})
export class TemplatesComponent implements OnInit {
  private router = inject(Router);
  private contextService = inject(ContextService);
  
  navItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'services', label: 'Services' },
    { id: 'ideal-clients', label: 'Clients' },
    { id: 'templates', label: 'Templates' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' },
  ];

  templates = [
    {
      name: 'Aries Grooming',
      industry: 'Barber Shop',
      demoUrl: 'https://arfahad99.github.io/AVT1_BarberShop/',
      image: 'assets/templates/aries_grooming.png',
      description: 'Aries Grooming is a modern barber shop offering professional haircuts and grooming services tailored to each client. Known for its clean environment and skilled barbers...',
      badge: 'Popular'
    },
    {
      name: 'AVT Restaurant',
      industry: 'Food & Beverage',
      demoUrl: 'https://abdsayeed.github.io/AVT1-Restaurant/',
      image: 'assets/templates/avt_restaurant.png',
      description: 'AVT Restaurant offers a welcoming dining experience with a focus on fresh ingredients and well-prepared dishes...',
      badge: 'Popular'
    },
    {
      name: 'Aries Ventures',
      industry: 'Barber Shop',
      demoUrl: 'https://arfahad99.github.io/AVT2_BarberShop/',
      image: 'assets/templates/aries_ventures_barber.png',
      description: 'Aries Ventures Premium Barber is a high-end grooming destination offering expert haircuts and premium barbering services...',
      badge: 'Popular'
    },
    {
      name: 'AVT Restaurant',
      industry: 'Food & Beverage',
      demoUrl: 'https://abdsayeed.github.io/AVT2/',
      image: 'assets/templates/avt_restaurant2.png',
      description: 'AVT Restaurant offers traditional cuisine prepared with a strong focus on hygiene and cleanliness...',
      badge: 'High Conversion'
    },
    {
      name: 'AVT Restaurant',
      industry: 'Food & Beverage',
      demoUrl: 'https://abdsayeed.github.io/AVT3/',
      image: 'assets/templates/avt_restaurant3.png',
      description: 'AVT Restaurant is an authentic Newari restaurant offering traditional dishes rich in flavor and heritage...',
      badge: ''
    },
    {
      name: 'AVT Restaurant',
      industry: 'Food & Beverage',
      demoUrl: 'https://abdsayeed.github.io/AVT4/',
      image: 'assets/templates/avt_restaurant4.png',
      description: 'Aries Ventures offers an exquisite dining experience with a focus on refined flavors and elegant presentation...',
      badge: 'Popular'
    },
    {
      name: 'AV Saloon',
      industry: 'Barber Shop',
      demoUrl: 'https://arfahad99.github.io/AVT3_Salon-master/',
      image: 'assets/templates/aries_grooming2.png',
      description: 'AV Salon offers professional hair and beauty services tailored to enhance your personal style...',
      badge: 'Popular'
    }
  ];

  pricingPlans = [
    {
      name: 'Pay-As-You-Go Website',
      price: '£59', priceLabel: '/month', color: 'primary', badge: 'Most Accessible',
      description: 'Template-based website with ongoing support.',
      features: ['5-page responsive website', 'Contact form & Google Maps', 'Hosting, SSL & backups'],
      contractInfo: '6 or 12-month minimum • Website licensed, not owned • Buyout option available',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjbP5WHr5GN8HwXnnPm_6y6Q5P2ZrF3R54b6XSYmGLlP4i_BLEajfSjmUfNH0-0j--gplRqJNz71kqJr2iBQkJeSEjtb3YTMi34DWTfDV5emh3SY0Ea6QRkCEaPqBCYrKDI-8iZSqfiDPXzpqaffPgFPa2v0Rf8D85Wz3R_c-pHEym3PSch-XBZ00WyKt4IaEZ0hw1tODfN8EZVpcc5lb49y6EnrhL3NylzNUwacNaCunOgFo49yVQ5L2wG4i1-2FvqR2fZwUHtek'
    },
    {
      name: 'Fully Managed Professional Website',
      price: '£249', priceLabel: '/month', color: 'blue', badge: 'Most Popular',
      description: 'Full professional website with zero technical hassle.',
      features: ['Up to 12-15 pages', 'Mobile-first & fully responsive', 'Advanced forms'],
      contractInfo: '6 or 12-month minimum • We own & manage • Buyout option available',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9vM4wxIs7Ig9a-uxSMgH3r_RO1Lxw0lV1Teix-0yAsRqpLSKGCLaP2_InA2cA0f4WmdB_JGuynvO7Qrm900dMJTE-57FpMEEooZ4tsO5YqYxcX5suN1pouZVjmTSrEC4PoBBFA-LkLIJLC4FkEz1VkE4zn53EfDeMhd0bDFgD5Knrgprk73SMUek0fwzkxhDdeCo0bBiGqCXh6UCggdKklWoJyl7bMdK7lHu_ctFAJxK0r7EeCPnQwhranFYIP8mUlWNg8csWtDQ'
    },
    {
      name: 'Full Professional Website',
      price: 'Custom', priceLabel: 'One-time', color: 'green', badge: 'Full Ownership',
      description: 'Fully custom professional website. You own everything with full control.',
      features: ['Fully custom design', 'Unlimited pages & features', 'Full source code included'],
      contractInfo: 'One-time payment • You own everything • No long-term contract • Maintenance optional',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzyD-l1502LRC-sfVKdfLlsOK7ON2gelcz0O75disd6NO6RJj67WTZZrsh5AkgdrX2FGjVeEgagiOAkA7lZoDbuTFyeCtiEBm4FwVTqRXFAGR0weFzsUkg0-dirUkWZwOqzKmr0Y5ugz9ha21YmcbccTx795lwBosFPKe0N3vTizX69GxDTKUgw3FvqJrqBujIK68T3RIXlDUIXelbF4xBDf3vm5YhJL_pHORuHrvBOgwCTZgl8C3buKbAwF4HCqwlyYeug4AsFxQ'
    }
  ];

  ngOnInit() {
    window.scrollTo(0, 0);
    this.addScrollAnimations();
  }

  handleNavigation(sectionId: string) {
    if (sectionId === 'templates') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/'], { fragment: sectionId });
    }
  }

  useTemplate(template: any) {
    this.contextService.navigateToContactWithTemplate(
      template.name.toLowerCase().replace(/\s+/g, "-"),
      template.name,
      template.industry
    );
  }

  selectPlan(plan: any) {
    const tierMap: Record<string, string> = {
      "Pay-As-You-Go Website": "basic",
      "Fully Managed Professional Website": "pro",
      "Full Professional Website": "custom",
    };
    this.contextService.navigateToContactWithPricing(
      tierMap[plan.name] || "basic",
      plan.price
    );
  }

  viewLiveDemo(template: any) {
    if (template.demoUrl) {
      window.open(template.demoUrl, "_blank");
    } else {
      alert(`Live demo for ${template.name} coming soon!`);
    }
  }

  goToContactForm() {
    this.router.navigate(['/contact']);
  }

  private addScrollAnimations() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.cinematic-reveal');
      elements.forEach(el => {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-6');
      });
    }, 100);
  }
}

