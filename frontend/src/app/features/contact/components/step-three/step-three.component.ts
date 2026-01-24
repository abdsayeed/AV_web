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

  services: Service[] = [
    {
      id: 'web_design',
      name: 'Web Design & Development',
      description: 'Custom website design and development',
      icon: '💻',
      timeline: '2-6 weeks'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Solutions',
      description: 'Online store setup and optimization',
      icon: '🛒',
      timeline: '3-8 weeks',
      popular: true
    },
    {
      id: 'seo',
      name: 'SEO Optimization',
      description: 'Search engine ranking improvement',
      icon: '🔍',
      timeline: '3-6 months ongoing'
    },
    {
      id: 'uiux',
      name: 'UI/UX Design',
      description: 'User experience optimization',
      icon: '🎨',
      timeline: '2-4 weeks'
    },
    {
      id: 'maintenance',
      name: 'Maintenance & Support',
      description: 'Ongoing website management',
      icon: '🔧',
      timeline: 'Monthly retainer'
    },
    {
      id: 'content',
      name: 'Content Creation',
      description: 'Copywriting, images, branding',
      icon: '📝',
      timeline: '1-3 weeks'
    }
  ];

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
