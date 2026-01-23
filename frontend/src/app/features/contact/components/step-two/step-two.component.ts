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
            <option value="retail">💈 Retail & E-commerce</option>
            <option value="restaurant">☕ Restaurant & Food Service</option>
            <option value="healthcare">🏥 Healthcare</option>
            <option value="tech">💻 Technology</option>
            <option value="real_estate">🏠 Real Estate</option>
            <option value="education">📚 Education</option>
            <option value="professional">💼 Professional Services</option>
            <option value="home_services">🔧 Home Services</option>
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
          
          <div class="grid grid-cols-2 gap-3">
            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'ecommerce'"
                   [class.bg-blue-50]="form.value.websiteType === 'ecommerce'"
                   [class.border-gray-300]="form.value.websiteType !== 'ecommerce'">
              <input type="radio" formControlName="websiteType" value="ecommerce" class="mr-2">
              <span class="text-sm font-medium">🛒 E-commerce</span>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'portfolio'"
                   [class.bg-blue-50]="form.value.websiteType === 'portfolio'"
                   [class.border-gray-300]="form.value.websiteType !== 'portfolio'">
              <input type="radio" formControlName="websiteType" value="portfolio" class="mr-2">
              <span class="text-sm font-medium">🎨 Portfolio</span>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'blog'"
                   [class.bg-blue-50]="form.value.websiteType === 'blog'"
                   [class.border-gray-300]="form.value.websiteType !== 'blog'">
              <input type="radio" formControlName="websiteType" value="blog" class="mr-2">
              <span class="text-sm font-medium">📝 Blog</span>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'corporate'"
                   [class.bg-blue-50]="form.value.websiteType === 'corporate'"
                   [class.border-gray-300]="form.value.websiteType !== 'corporate'">
              <input type="radio" formControlName="websiteType" value="corporate" class="mr-2">
              <span class="text-sm font-medium">🏢 Corporate</span>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'landing'"
                   [class.bg-blue-50]="form.value.websiteType === 'landing'"
                   [class.border-gray-300]="form.value.websiteType !== 'landing'">
              <input type="radio" formControlName="websiteType" value="landing" class="mr-2">
              <span class="text-sm font-medium">🚀 Landing Page</span>
            </label>

            <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.websiteType === 'custom'"
                   [class.bg-blue-50]="form.value.websiteType === 'custom'"
                   [class.border-gray-300]="form.value.websiteType !== 'custom'">
              <input type="radio" formControlName="websiteType" value="custom" class="mr-2">
              <span class="text-sm font-medium">✨ Custom</span>
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
  }

  ngOnInit(): void {
    this.loadSavedData();
  }

  private loadSavedData(): void {
    const saved = this.formStateService.getFormData();
    if (saved.businessInfo) {
      this.form.patchValue(saved.businessInfo);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.completed.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
