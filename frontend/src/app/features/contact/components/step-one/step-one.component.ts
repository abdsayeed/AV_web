import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormStateService } from '../../../../core/services/form-state.service';
import { ContextService } from '../../../../core/services/context.service';

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="step-one">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Let's Get Started</h2>
      <p class="text-gray-600 mb-6">Tell us what brings you here today</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        
        <!-- Primary Goal -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            What's your primary goal? <span class="text-red-500">*</span>
          </label>
          
          <div class="space-y-3">
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.primaryGoal === 'new_website'"
                   [class.bg-blue-50]="form.value.primaryGoal === 'new_website'"
                   [class.border-gray-300]="form.value.primaryGoal !== 'new_website'">
              <input type="radio" formControlName="primaryGoal" value="new_website" class="mr-3">
              <div>
                <span class="font-medium text-gray-900">🌟 Build a New Website</span>
                <p class="text-sm text-gray-500">Starting from scratch</p>
              </div>
            </label>

            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.primaryGoal === 'redesign'"
                   [class.bg-blue-50]="form.value.primaryGoal === 'redesign'"
                   [class.border-gray-300]="form.value.primaryGoal !== 'redesign'">
              <input type="radio" formControlName="primaryGoal" value="redesign" class="mr-3">
              <div>
                <span class="font-medium text-gray-900">🔄 Redesign Existing Site</span>
                <p class="text-sm text-gray-500">Modernize and improve</p>
              </div>
            </label>

            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.primaryGoal === 'add_features'"
                   [class.bg-blue-50]="form.value.primaryGoal === 'add_features'"
                   [class.border-gray-300]="form.value.primaryGoal !== 'add_features'">
              <input type="radio" formControlName="primaryGoal" value="add_features" class="mr-3">
              <div>
                <span class="font-medium text-gray-900">⚡ Add Features</span>
                <p class="text-sm text-gray-500">Enhance current website</p>
              </div>
            </label>

            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.primaryGoal === 'consultation'"
                   [class.bg-blue-50]="form.value.primaryGoal === 'consultation'"
                   [class.border-gray-300]="form.value.primaryGoal !== 'consultation'">
              <input type="radio" formControlName="primaryGoal" value="consultation" class="mr-3">
              <div>
                <span class="font-medium text-gray-900">💡 Consultation</span>
                <p class="text-sm text-gray-500">Explore options and get advice</p>
              </div>
            </label>

            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                   [class.border-blue-600]="form.value.primaryGoal === 'other'"
                   [class.bg-blue-50]="form.value.primaryGoal === 'other'"
                   [class.border-gray-300]="form.value.primaryGoal !== 'other'">
              <input type="radio" formControlName="primaryGoal" value="other" class="mr-3">
              <div>
                <span class="font-medium text-gray-900">🤔 Something Else</span>
                <p class="text-sm text-gray-500">Let's discuss your needs</p>
              </div>
            </label>
          </div>

          @if (form.controls['primaryGoal'].invalid && form.controls['primaryGoal'].touched) {
            <p class="mt-2 text-sm text-red-600">Please select your primary goal</p>
          }
        </div>

        <!-- Continue Button -->
        <button
          type="submit"
          class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Continue to Business Info →
        </button>
      </form>
    </div>
  `
})
export class StepOneComponent implements OnInit {
  @Output() completed = new EventEmitter<any>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formStateService: FormStateService,
    private contextService: ContextService
  ) {
    this.form = this.fb.group({
      source: ['direct'],
      referrer: [''],
      templateId: [''],
      serviceId: [''],
      primaryGoal: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSavedData();
    this.loadContext();
  }

  private loadSavedData(): void {
    const saved = this.formStateService.getFormData();
    if (saved.context) {
      this.form.patchValue(saved.context);
    }
  }

  private loadContext(): void {
    const context = this.contextService.getContext();
    if (context) {
      this.form.patchValue({
        source: context.source,
        templateId: context.data['templateId'] || '',
        serviceId: context.data['serviceId'] || ''
      });
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
