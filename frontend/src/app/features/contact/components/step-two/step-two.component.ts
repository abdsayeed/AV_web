import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormStateService } from '../../../../core/services/form-state.service';

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="step-two">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Business Information</h2>
      <p class="text-gray-600 mb-6">Help us understand your business</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        
        <!-- Business Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Business Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            formControlName="name"
            placeholder="Your Business Name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [class.border-red-500]="form.controls['name'].invalid && form.controls['name'].touched">
          @if (form.controls['name'].invalid && form.controls['name'].touched) {
            <p class="mt-1 text-sm text-red-600">Business name is required</p>
          }
        </div>

        <!-- Industry -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Industry <span class="text-red-500">*</span>
          </label>
          <select
            formControlName="industry"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [class.border-red-500]="form.controls['industry'].invalid && form.controls['industry'].touched">
            <option value="">Select your industry</option>
            <option value="retail">🛍️ Retail & E-commerce</option>
            <option value="restaurant">🍽️ Restaurant & Food Service</option>
            <option value="healthcare">🏥 Healthcare & Medical</option>
            <option value="tech">💻 Technology & Software</option>
            <option value="real_estate">🏠 Real Estate</option>
            <option value="education">📚 Education & Training</option>
            <option value="professional">💼 Professional Services</option>
            <option value="home_services">🔧 Home Services & Repair</option>
            <option value="fitness">💪 Fitness & Wellness</option>
            <option value="beauty">💄 Beauty & Personal Care</option>
            <option value="automotive">🚗 Automotive</option>
            <option value="finance">💰 Finance & Insurance</option>
            <option value="nonprofit">❤️ Non-profit & Charity</option>
            <option value="entertainment">🎭 Entertainment & Events</option>
            <option value="travel">✈️ Travel & Tourism</option>
            <option value="other">🤔 Other</option>
          </select>
          @if (form.controls['industry'].invalid && form.controls['industry'].touched) {
            <p class="mt-1 text-sm text-red-600">Please select an industry</p>
          }
        </div>

        <!-- Current Website -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Current Website <span class="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            formControlName="currentWebsite"
            placeholder="https://yourwebsite.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <p class="mt-1 text-xs text-gray-500">If you have an existing website</p>
        </div>

        <!-- Website Type -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            What type of website do you need? <span class="text-red-500">*</span>
          </label>
          
          <!-- Industry-based suggestions -->
          @if (showSuggestions) {
            <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-2 mb-2">
                <span class="material-symbols-outlined text-blue-600 text-lg mt-0.5">lightbulb</span>
                <div>
                  <h4 class="text-sm font-semibold text-blue-900">Recommended for your industry:</h4>
                  <p class="text-xs text-blue-700 mt-1">Based on your selected industry, these website types work best:</p>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                @for (type of suggestedWebsiteTypes; track type) {
                  <button
                    type="button"
                    (click)="selectWebsiteType(type)"
                    class="px-3 py-1.5 text-xs font-medium rounded-full border-2 transition-all"
                    [class.bg-blue-600]="form.value.websiteType === type"
                    [class.text-white]="form.value.websiteType === type"
                    [class.border-blue-600]="form.value.websiteType === type"
                    [class.bg-white]="form.value.websiteType !== type"
                    [class.text-blue-600]="form.value.websiteType !== type"
                    [class.border-blue-300]="form.value.websiteType !== type"
                    [class.hover:border-blue-500]="form.value.websiteType !== type">
                    {{ getWebsiteTypeLabel(type) }}
                  </button>
                }
              </div>
            </div>
          }
          
          <div class="grid grid-cols-2 gap-3">
            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'ecommerce'"
                   [class.bg-blue-50]="form.value.websiteType === 'ecommerce'"
                   [class.border-gray-300]="form.value.websiteType !== 'ecommerce'"
                   [class.ring-2]="suggestedWebsiteTypes.includes('ecommerce')"
                   [class.ring-blue-200]="suggestedWebsiteTypes.includes('ecommerce')">
              <input type="radio" formControlName="websiteType" value="ecommerce" class="mr-2">
              <div class="flex-1">
                <span class="text-sm font-medium flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">shopping_cart</span>
                  E-commerce
                  @if (suggestedWebsiteTypes.includes('ecommerce')) {
                    <span class="material-symbols-outlined text-blue-600 text-sm">recommend</span>
                  }
                </span>
                <p class="text-xs text-gray-500 mt-1">{{ websiteTypeDescriptions['ecommerce'] }}</p>
              </div>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'portfolio'"
                   [class.bg-blue-50]="form.value.websiteType === 'portfolio'"
                   [class.border-gray-300]="form.value.websiteType !== 'portfolio'"
                   [class.ring-2]="suggestedWebsiteTypes.includes('portfolio')"
                   [class.ring-blue-200]="suggestedWebsiteTypes.includes('portfolio')">
              <input type="radio" formControlName="websiteType" value="portfolio" class="mr-2">
              <div class="flex-1">
                <span class="text-sm font-medium flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">palette</span>
                  Portfolio
                  @if (suggestedWebsiteTypes.includes('portfolio')) {
                    <span class="material-symbols-outlined text-blue-600 text-sm">recommend</span>
                  }
                </span>
                <p class="text-xs text-gray-500 mt-1">{{ websiteTypeDescriptions['portfolio'] }}</p>
              </div>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'blog'"
                   [class.bg-blue-50]="form.value.websiteType === 'blog'"
                   [class.border-gray-300]="form.value.websiteType !== 'blog'"
                   [class.ring-2]="suggestedWebsiteTypes.includes('blog')"
                   [class.ring-blue-200]="suggestedWebsiteTypes.includes('blog')">
              <input type="radio" formControlName="websiteType" value="blog" class="mr-2">
              <div class="flex-1">
                <span class="text-sm font-medium flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">edit</span>
                  Blog
                  @if (suggestedWebsiteTypes.includes('blog')) {
                    <span class="material-symbols-outlined text-blue-600 text-sm">recommend</span>
                  }
                </span>
                <p class="text-xs text-gray-500 mt-1">{{ websiteTypeDescriptions['blog'] }}</p>
              </div>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'corporate'"
                   [class.bg-blue-50]="form.value.websiteType === 'corporate'"
                   [class.border-gray-300]="form.value.websiteType !== 'corporate'"
                   [class.ring-2]="suggestedWebsiteTypes.includes('corporate')"
                   [class.ring-blue-200]="suggestedWebsiteTypes.includes('corporate')">
              <input type="radio" formControlName="websiteType" value="corporate" class="mr-2">
              <div class="flex-1">
                <span class="text-sm font-medium flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">business</span>
                  Corporate
                  @if (suggestedWebsiteTypes.includes('corporate')) {
                    <span class="material-symbols-outlined text-blue-600 text-sm">recommend</span>
                  }
                </span>
                <p class="text-xs text-gray-500 mt-1">{{ websiteTypeDescriptions['corporate'] }}</p>
              </div>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'landing'"
                   [class.bg-blue-50]="form.value.websiteType === 'landing'"
                   [class.border-gray-300]="form.value.websiteType !== 'landing'"
                   [class.ring-2]="suggestedWebsiteTypes.includes('landing')"
                   [class.ring-blue-200]="suggestedWebsiteTypes.includes('landing')">
              <input type="radio" formControlName="websiteType" value="landing" class="mr-2">
              <div class="flex-1">
                <span class="text-sm font-medium flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">rocket_launch</span>
                  Landing Page
                  @if (suggestedWebsiteTypes.includes('landing')) {
                    <span class="material-symbols-outlined text-blue-600 text-sm">recommend</span>
                  }
                </span>
                <p class="text-xs text-gray-500 mt-1">{{ websiteTypeDescriptions['landing'] }}</p>
              </div>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'custom'"
                   [class.bg-blue-50]="form.value.websiteType === 'custom'"
                   [class.border-gray-300]="form.value.websiteType !== 'custom'"
                   [class.ring-2]="suggestedWebsiteTypes.includes('custom')"
                   [class.ring-blue-200]="suggestedWebsiteTypes.includes('custom')">
              <input type="radio" formControlName="websiteType" value="custom" class="mr-2">
              <div class="flex-1">
                <span class="text-sm font-medium flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">auto_awesome</span>
                  Custom
                  @if (suggestedWebsiteTypes.includes('custom')) {
                    <span class="material-symbols-outlined text-blue-600 text-sm">recommend</span>
                  }
                </span>
                <p class="text-xs text-gray-500 mt-1">{{ websiteTypeDescriptions['custom'] }}</p>
              </div>
            </label>
          </div>

          @if (form.controls['websiteType'].invalid && form.controls['websiteType'].touched) {
            <p class="mt-2 text-sm text-red-600">Please select a website type</p>
          }
        </div>

        <!-- Continue Button -->
        <button
          type="submit"
          class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Continue to Requirements →
        </button>
      </form>
    </div>
  `
})
export class StepTwoComponent implements OnInit {
  @Output() completed = new EventEmitter<any>();

  form: FormGroup;
  suggestedWebsiteTypes: string[] = [];
  showSuggestions = false;

  // Industry to website type mapping
  private industryWebsiteMapping = {
    'retail': ['ecommerce', 'corporate'],
    'restaurant': ['corporate', 'ecommerce'],
    'healthcare': ['corporate', 'landing'],
    'tech': ['corporate', 'portfolio'],
    'real_estate': ['portfolio', 'corporate'],
    'education': ['corporate', 'blog'],
    'professional': ['corporate', 'portfolio'],
    'home_services': ['corporate', 'landing'],
    'fitness': ['corporate', 'landing'],
    'beauty': ['corporate', 'ecommerce'],
    'automotive': ['corporate', 'ecommerce'],
    'finance': ['corporate', 'landing'],
    'nonprofit': ['corporate', 'blog'],
    'entertainment': ['portfolio', 'corporate'],
    'travel': ['corporate', 'blog'],
    'other': ['corporate', 'custom']
  };

  // Website type descriptions for suggestions
  websiteTypeDescriptions = {
    'ecommerce': 'Perfect for selling products online with shopping cart functionality',
    'portfolio': 'Showcase your work, projects, and achievements professionally',
    'blog': 'Share knowledge, insights, and build thought leadership',
    'corporate': 'Professional business presence with company information and services',
    'landing': 'Focused single-page site for specific campaigns or services',
    'custom': 'Unique solution tailored to your specific business needs'
  };

  constructor(
    private fb: FormBuilder,
    private formStateService: FormStateService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      industry: ['', Validators.required],
      currentWebsite: [''],
      websiteType: ['', Validators.required]
    });

    // Watch for industry changes to provide suggestions
    this.form.get('industry')?.valueChanges.subscribe(industry => {
      this.onIndustryChange(industry);
    });
  }

  ngOnInit(): void {
    this.loadSavedData();
  }

  private loadSavedData(): void {
    const saved = this.formStateService.getFormData();
    if (saved.businessInfo) {
      this.form.patchValue(saved.businessInfo);
      // Trigger suggestions if industry is already selected
      if (saved.businessInfo.industry) {
        this.onIndustryChange(saved.businessInfo.industry);
      }
    }
  }

  private onIndustryChange(industry: string): void {
    if (industry && this.industryWebsiteMapping[industry as keyof typeof this.industryWebsiteMapping]) {
      this.suggestedWebsiteTypes = this.industryWebsiteMapping[industry as keyof typeof this.industryWebsiteMapping];
      this.showSuggestions = true;
      
      // Auto-select the first suggested type if no type is currently selected
      if (!this.form.get('websiteType')?.value && this.suggestedWebsiteTypes.length > 0) {
        this.form.get('websiteType')?.setValue(this.suggestedWebsiteTypes[0]);
      }
    } else {
      this.suggestedWebsiteTypes = [];
      this.showSuggestions = false;
    }
  }

  selectWebsiteType(type: string): void {
    this.form.get('websiteType')?.setValue(type);
  }

  getWebsiteTypeLabel(type: string): string {
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

  onSubmit(): void {
    if (this.form.valid) {
      this.completed.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
