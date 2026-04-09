import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guided-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guided-onboarding.component.html'
})
export class GuidedOnboardingComponent {
  private router = inject(Router);

  currentStep = 1;
  totalSteps = 5;

  data = {
    businessName: '',
    industry: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    primaryColor: '#0058be',
    templateId: '',
    pages: [] as string[],
    extras: [] as string[]
  };

  industries = [
    'Barbershop', 'Restaurant / Café', 'Salon / Beauty',
    'Retail / Shop', 'Plumber / Electrician', 'Landscaping',
    'Cleaning Services', 'Personal Trainer', 'Other'
  ];

  templates = [
    { id: 'grooming', name: 'Aries Grooming', industry: 'Barber', image: 'assets/templates/aries_grooming.png' },
    { id: 'restaurant', name: 'AVT Restaurant', industry: 'Food', image: 'assets/templates/avt_restaurant.png' },
    { id: 'barber2', name: 'AV Premium Barber', industry: 'Barber', image: 'assets/templates/aries_ventures_barber.png' },
    { id: 'saloon', name: 'AV Saloon', industry: 'Beauty', image: 'assets/templates/aries_grooming2.png' }
  ];

  pageOptions = [
    { id: 'home', label: 'Home', required: true },
    { id: 'about', label: 'About Us', required: false },
    { id: 'services', label: 'Services', required: false },
    { id: 'gallery', label: 'Gallery', required: false },
    { id: 'booking', label: 'Booking', required: false },
    { id: 'contact', label: 'Contact', required: true }
  ];

  extraOptions = [
    { id: 'seo', label: 'SEO Setup', desc: 'Rank higher on Google' },
    { id: 'analytics', label: 'Analytics', desc: 'Track your visitors' },
    { id: 'chat', label: 'Live Chat', desc: 'Chat with customers' },
    { id: 'social', label: 'Social Links', desc: 'Link your socials' }
  ];

  colors = ['#0058be', '#1a1c1e', '#16a34a', '#dc2626', '#9333ea', '#ea580c'];

  constructor() {
    // Pre-select required pages
    this.data.pages = ['home', 'contact'];
  }

  togglePage(id: string, required: boolean) {
    if (required) return;
    const idx = this.data.pages.indexOf(id);
    if (idx > -1) this.data.pages.splice(idx, 1);
    else this.data.pages.push(id);
  }

  hasPage(id: string) { return this.data.pages.includes(id); }

  toggleExtra(id: string) {
    const idx = this.data.extras.indexOf(id);
    if (idx > -1) this.data.extras.splice(idx, 1);
    else this.data.extras.push(id);
  }

  hasExtra(id: string) { return this.data.extras.includes(id); }

  selectTemplate(id: string) { this.data.templateId = id; }
  selectColor(c: string) { this.data.primaryColor = c; }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1: return !!this.data.businessName && !!this.data.industry;
      case 2: return !!this.data.templateId;
      case 3: return this.data.pages.length >= 2;
      case 4: return !!this.data.email;
      default: return true;
    }
  }

  next() { if (this.currentStep < this.totalSteps) this.currentStep++; }
  back() { if (this.currentStep > 1) this.currentStep--; }
  skip() { this.router.navigate(['/dashboard']); }

  submit() { this.router.navigate(['/contact']); }

  get progress() { return (this.currentStep / this.totalSteps) * 100; }

  get stepLabels() {
    return ['Business', 'Template', 'Pages', 'Contact', 'Review'];
  }
}
