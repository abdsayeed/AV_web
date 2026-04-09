import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './onboarding.component.html'
})
export class OnboardingComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentStep = 1;
  totalSteps = 4;

  data = {
    businessType: '',
    businessName: '',
    website: '',
    goal: '',
    budget: '',
    timeline: '',
    features: [] as string[],
    phone: ''
  };

  businessTypes = [
    { id: 'barbershop', label: 'Barbershop', icon: 'content_cut' },
    { id: 'restaurant', label: 'Restaurant / Café', icon: 'restaurant' },
    { id: 'salon', label: 'Salon / Beauty', icon: 'spa' },
    { id: 'retail', label: 'Retail / Shop', icon: 'storefront' },
    { id: 'trades', label: 'Trades / Services', icon: 'home_repair_service' },
    { id: 'other', label: 'Other', icon: 'business_center' }
  ];

  goals = [
    { id: 'leads', label: 'Get more leads', icon: 'trending_up' },
    { id: 'bookings', label: 'Take online bookings', icon: 'calendar_month' },
    { id: 'presence', label: 'Build online presence', icon: 'language' },
    { id: 'sales', label: 'Sell products online', icon: 'shopping_cart' }
  ];

  budgets = [
    { id: 'basic', label: '£59 / month', desc: 'Pay-As-You-Go' },
    { id: 'pro', label: '£249 / month', desc: 'Fully Managed' },
    { id: 'custom', label: 'Custom', desc: 'One-time build' }
  ];

  featureOptions = [
    { id: 'booking', label: 'Online booking' },
    { id: 'gallery', label: 'Photo gallery' },
    { id: 'menu', label: 'Menu / price list' },
    { id: 'map', label: 'Google Maps' },
    { id: 'seo', label: 'SEO setup' },
    { id: 'blog', label: 'Blog / news' }
  ];

  selectBusinessType(id: string) { this.data.businessType = id; }
  selectGoal(id: string) { this.data.goal = id; }
  selectBudget(id: string) { this.data.budget = id; }

  toggleFeature(id: string) {
    const idx = this.data.features.indexOf(id);
    if (idx > -1) this.data.features.splice(idx, 1);
    else this.data.features.push(id);
  }

  hasFeature(id: string) { return this.data.features.includes(id); }

  next() { if (this.currentStep < this.totalSteps) this.currentStep++; }
  back() { if (this.currentStep > 1) this.currentStep--; }

  skip() { this.router.navigate(['/dashboard']); }

  finish() { this.router.navigate(['/contact']); }

  get progress() { return (this.currentStep / this.totalSteps) * 100; }
}
