import { Component, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormStateService } from '../../../../core/services/form-state.service';
import { Service, BudgetTier } from '../../../../core/models/contact-form.model';
import { ServiceCardComponent } from '../../../../shared/components/service-card/service-card.component';
import { BudgetSelectorComponent } from '../../../../shared/components/budget-selector/budget-selector.component';

@Component({
  selector: 'app-step-three',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ServiceCardComponent,
    BudgetSelectorComponent
  ],
  templateUrl: './step-three.component.html'
})
export class StepThreeComponent implements OnInit {
  @Output() completed = new EventEmitter<any>();

  form: FormGroup;
  showTimeline = signal(false);
  estimatedTimeline = signal('');
  suggestedServices: string[] = [];
  showSuggestions = false;

  services: Service[] = [
    {
      id: 'web_design',
      name: 'Web Design & Development',
      description: 'Custom website design and development',
      icon: 'web',
      timeline: '2-6 weeks'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Solutions',
      description: 'Online store setup and optimization',
      icon: 'shopping_cart',
      timeline: '3-8 weeks',
      popular: true
    },
    {
      id: 'seo',
      name: 'SEO Optimization',
      description: 'Search engine ranking improvement',
      icon: 'search',
      timeline: '3-6 months ongoing'
    },
    {
      id: 'uiux',
      name: 'UI/UX Design',
      description: 'User experience optimization',
      icon: 'palette',
      timeline: '2-4 weeks'
    },
    {
      id: 'maintenance',
      name: 'Maintenance & Support',
      description: 'Ongoing website management',
      icon: 'build',
      timeline: 'Monthly retainer'
    },
    {
      id: 'content',
      name: 'Content Creation',
      description: 'Copywriting, images, branding',
      icon: 'edit',
      timeline: '1-3 weeks'
    },
    {
      id: 'analytics',
      name: 'Analytics & Tracking',
      description: 'Performance monitoring and insights',
      icon: 'analytics',
      timeline: '1-2 weeks'
    },
    {
      id: 'social_media',
      name: 'Social Media Integration',
      description: 'Connect and manage social platforms',
      icon: 'share',
      timeline: '1-2 weeks'
    }
  ];

  // Industry and website type to services mapping
  private serviceRecommendations = {
    // E-commerce focused
    'retail_ecommerce': ['web_design', 'ecommerce', 'seo', 'analytics', 'maintenance'],
    'beauty_ecommerce': ['web_design', 'ecommerce', 'uiux', 'content', 'social_media'],
    'automotive_ecommerce': ['web_design', 'ecommerce', 'seo', 'maintenance'],
    
    // Corporate/Professional
    'professional_corporate': ['web_design', 'seo', 'content', 'maintenance'],
    'healthcare_corporate': ['web_design', 'seo', 'content', 'maintenance'],
    'finance_corporate': ['web_design', 'seo', 'maintenance'],
    'tech_corporate': ['web_design', 'uiux', 'seo', 'analytics'],
    'real_estate_corporate': ['web_design', 'seo', 'content', 'maintenance'],
    'home_services_corporate': ['web_design', 'seo', 'content', 'maintenance'],
    'fitness_corporate': ['web_design', 'seo', 'social_media', 'content'],
    'automotive_corporate': ['web_design', 'seo', 'content', 'maintenance'],
    'nonprofit_corporate': ['web_design', 'seo', 'content', 'social_media'],
    'travel_corporate': ['web_design', 'seo', 'content', 'social_media'],
    
    // Restaurant specific
    'restaurant_corporate': ['web_design', 'seo', 'social_media', 'maintenance'],
    'restaurant_ecommerce': ['web_design', 'ecommerce', 'seo', 'social_media'],
    
    // Portfolio focused
    'entertainment_portfolio': ['web_design', 'uiux', 'content', 'social_media'],
    'tech_portfolio': ['web_design', 'uiux', 'analytics'],
    'real_estate_portfolio': ['web_design', 'uiux', 'content', 'seo'],
    'professional_portfolio': ['web_design', 'uiux', 'content'],
    
    // Blog focused
    'education_blog': ['web_design', 'content', 'seo', 'social_media'],
    'nonprofit_blog': ['web_design', 'content', 'seo', 'social_media'],
    'travel_blog': ['web_design', 'content', 'seo', 'social_media'],
    
    // Landing page focused
    'healthcare_landing': ['web_design', 'seo', 'analytics'],
    'home_services_landing': ['web_design', 'seo', 'analytics'],
    'fitness_landing': ['web_design', 'seo', 'analytics', 'social_media'],
    'finance_landing': ['web_design', 'seo', 'analytics'],
    
    // Custom solutions
    'other_custom': ['web_design', 'uiux', 'maintenance'],
    'tech_custom': ['web_design', 'uiux', 'analytics', 'maintenance']
  };

  budgetTiers: BudgetTier[] = [
    {
      id: 'basic',
      name: 'PAY-AS-YOU-GO',
      price: '£59/mo',
      features: [
        '5-page responsive website',
        'Template-based design',
        'Contact form & maps',
        'Basic SEO setup',
        'Hosting & SSL included',
        'Security updates',
        'Small content changes'
      ],
      perfectFor: [
        'Small businesses',
        'Starting online',
        'Low upfront cost'
      ]
    },
    {
      id: 'pro',
      name: 'FULLY MANAGED',
      price: '£249/mo',
      badge: 'POPULAR',
      features: [
        'Up to 12-15 pages',
        'Custom brand design',
        'Mobile-first responsive',
        'Advanced forms & CMS',
        'Advanced SEO',
        'Premium hosting & CDN',
        'Unlimited updates',
        'Priority support'
      ],
      perfectFor: [
        'Growing businesses',
        'Zero technical hassle',
        'Full management'
      ],
      popular: true
    },
    {
      id: 'custom',
      name: 'FULL OWNERSHIP',
      price: 'Custom',
      features: [
        'Fully custom design',
        'Unlimited pages',
        'Advanced integrations',
        'Blog / CMS',
        'SEO-ready',
        'You own everything',
        'Source code included',
        'Optional maintenance'
      ],
      perfectFor: [
        'Full control',
        'One-time payment',
        'No contracts'
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private formStateService: FormStateService
  ) {
    this.form = this.fb.group({
      servicesNeeded: [[], [Validators.required, Validators.minLength(1)]],
      budgetRange: ['', Validators.required],
      timeline: ['flexible'],
      targetDate: [''],
      additionalRequirements: ['']
    });
  }

  ngOnInit(): void {
    this.loadSavedData();
    this.generateServiceRecommendations();
    this.form.valueChanges.subscribe(() => {
      this.calculateTimeline();
    });
  }

  private loadSavedData(): void {
    const saved = this.formStateService.getFormData();
    if (saved.projectRequirements) {
      this.form.patchValue(saved.projectRequirements);
    }
  }

  private generateServiceRecommendations(): void {
    const saved = this.formStateService.getFormData();
    const businessInfo = saved.businessInfo;
    
    if (businessInfo?.industry && businessInfo?.websiteType) {
      const key = `${businessInfo.industry}_${businessInfo.websiteType}`;
      const recommendations = this.serviceRecommendations as Record<string, string[]>;
      this.suggestedServices = recommendations[key] || [];
      
      // Fallback to industry-based recommendations if specific combination not found
      if (this.suggestedServices.length === 0) {
        this.suggestedServices = this.getIndustryBasedRecommendations(businessInfo.industry);
      }
      
      this.showSuggestions = this.suggestedServices.length > 0;
      
      // Auto-select recommended services if none are currently selected
      const currentServices = this.form.get('servicesNeeded')?.value || [];
      if (currentServices.length === 0 && this.suggestedServices.length > 0) {
        // Auto-select the top 3 recommended services
        const autoSelected = this.suggestedServices.slice(0, 3);
        this.form.patchValue({ servicesNeeded: autoSelected });
      }
    }
  }

  private getIndustryBasedRecommendations(industry: string): string[] {
    const industryDefaults: { [key: string]: string[] } = {
      'retail': ['web_design', 'ecommerce', 'seo'],
      'restaurant': ['web_design', 'seo', 'social_media'],
      'healthcare': ['web_design', 'seo', 'content'],
      'tech': ['web_design', 'uiux', 'analytics'],
      'real_estate': ['web_design', 'seo', 'content'],
      'education': ['web_design', 'content', 'seo'],
      'professional': ['web_design', 'seo', 'content'],
      'home_services': ['web_design', 'seo', 'maintenance'],
      'fitness': ['web_design', 'seo', 'social_media'],
      'beauty': ['web_design', 'ecommerce', 'social_media'],
      'automotive': ['web_design', 'seo', 'maintenance'],
      'finance': ['web_design', 'seo', 'maintenance'],
      'nonprofit': ['web_design', 'content', 'seo'],
      'entertainment': ['web_design', 'uiux', 'social_media'],
      'travel': ['web_design', 'content', 'seo']
    };
    
    return industryDefaults[industry] || ['web_design', 'seo', 'maintenance'];
  }

  getBusinessContext(): { industry: string; websiteType: string } | null {
    const saved = this.formStateService.getFormData();
    const businessInfo = saved.businessInfo;
    
    if (businessInfo?.industry && businessInfo?.websiteType) {
      return {
        industry: this.getIndustryLabel(businessInfo.industry),
        websiteType: this.getWebsiteTypeLabel(businessInfo.websiteType)
      };
    }
    
    return null;
  }

  private getIndustryLabel(industry: string): string {
    const labels: { [key: string]: string } = {
      'retail': 'Retail & E-commerce',
      'restaurant': 'Restaurant & Food Service',
      'healthcare': 'Healthcare & Medical',
      'tech': 'Technology & Software',
      'real_estate': 'Real Estate',
      'education': 'Education & Training',
      'professional': 'Professional Services',
      'home_services': 'Home Services & Repair',
      'fitness': 'Fitness & Wellness',
      'beauty': 'Beauty & Personal Care',
      'automotive': 'Automotive',
      'finance': 'Finance & Insurance',
      'nonprofit': 'Non-profit & Charity',
      'entertainment': 'Entertainment & Events',
      'travel': 'Travel & Tourism',
      'other': 'Other'
    };
    return labels[industry] || industry;
  }

  private getWebsiteTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'ecommerce': 'E-commerce',
      'portfolio': 'Portfolio',
      'blog': 'Blog',
      'corporate': 'Corporate',
      'landing': 'Landing Page',
      'custom': 'Custom'
    };
    return labels[type] || type;
  }

  isServiceRecommended(serviceId: string): boolean {
    return this.suggestedServices.includes(serviceId);
  }

  selectRecommendedServices(): void {
    this.form.patchValue({ servicesNeeded: [...this.suggestedServices] });
  }

  getServiceById(serviceId: string): Service | undefined {
    return this.services.find(s => s.id === serviceId);
  }

  onServiceToggle(serviceId: string): void {
    const current = this.form.value.servicesNeeded as string[];
    const index = current.indexOf(serviceId);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(serviceId);
    }
    
    this.form.patchValue({ servicesNeeded: current });
  }

  onBudgetSelect(tier: string): void {
    this.form.patchValue({ budgetRange: tier });
  }

  isServiceSelected(serviceId: string): boolean {
    return this.form.value.servicesNeeded.includes(serviceId);
  }

  private calculateTimeline(): void {
    const { servicesNeeded, budgetRange } = this.form.value;
    
    if (servicesNeeded.length > 0 && budgetRange) {
      let weeks = 0;
      
      if (servicesNeeded.includes('web_design')) weeks += 4;
      if (servicesNeeded.includes('ecommerce')) weeks += 6;
      if (servicesNeeded.includes('uiux')) weeks += 3;
      if (servicesNeeded.includes('content')) weeks += 2;
      
      if (budgetRange === 'basic') weeks = Math.ceil(weeks * 0.8);
      if (budgetRange === 'custom') weeks = Math.ceil(weeks * 1.2);
      
      this.estimatedTimeline.set(`${weeks} weeks`);
      this.showTimeline.set(true);
    } else {
      this.showTimeline.set(false);
    }
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.completed.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
