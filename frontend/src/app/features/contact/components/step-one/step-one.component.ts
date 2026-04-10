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
    <div class="cinematic-reveal">
      <h2 class="text-3xl font-headline font-bold text-on-surface mb-2">Tell us about your business</h2>
      <p class="text-on-surface-variant mb-10">We tailor our approach to your specific industry.</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
        
        <!-- Business Name -->
        <div>
          <label class="block text-sm font-semibold text-on-surface mb-3 pointer-events-none">Business Name <span class="text-error">*</span></label>
          <input type="text" formControlName="businessName"
                 class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                 placeholder="e.g. Aries Grooming">
          @if (form.controls['businessName'].invalid && form.controls['businessName'].touched) {
            <p class="mt-2 text-sm text-error font-medium">Business name is required</p>
          }
        </div>

        <!-- Industry -->
        <div>
          <label class="block text-sm font-semibold text-on-surface mb-3 pointer-events-none">Industry <span class="text-error">*</span></label>
          <div class="flex flex-wrap gap-3">
            @for (industry of industries; track industry) {
              <button type="button" 
                      (click)="form.patchValue({industry: industry})"
                      class="px-5 py-3 rounded-full text-sm font-semibold transition-all border"
                      [ngClass]="form.value.industry === industry 
                        ? 'bg-secondary text-on-primary border-secondary shadow-md shadow-secondary/20 scale-[1.02]' 
                        : 'bg-surface-container border-outline-variant/15 text-on-surface hover:bg-surface-container-high'">
                {{ industry }}
              </button>
            }
          </div>
          @if (form.controls['industry'].invalid && form.controls['industry'].touched) {
            <p class="mt-2 text-sm text-error font-medium">Please select an industry</p>
          }
        </div>

        <!-- Website Type -->
        <div>
          <label class="block text-sm font-semibold text-on-surface mb-3 pointer-events-none">Website Type <span class="text-error">*</span></label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div (click)="form.patchValue({websiteType: 'template'})"
                 class="p-6 rounded-3xl cursor-pointer transition-all border group relative"
                 [ngClass]="form.value.websiteType === 'template' 
                   ? 'bg-secondary-fixed/30 border-secondary ring-2 ring-secondary scale-[1.02]' 
                   : 'bg-surface-container-low border-outline-variant/15 hover:border-secondary/50'">
              <span class="material-symbols-outlined mb-3" [class.text-secondary]="form.value.websiteType === 'template'" [class.text-on-surface-variant]="form.value.websiteType !== 'template'">dashboard_customize</span>
              <h3 class="font-headline font-bold text-lg text-on-surface mb-1">Template-based</h3>
              <p class="text-sm text-on-surface-variant">Fast, proven templates configured for your brand.</p>
            </div>

            <div (click)="form.patchValue({websiteType: 'custom'})"
                 class="p-6 rounded-3xl cursor-pointer transition-all border group relative"
                 [ngClass]="form.value.websiteType === 'custom' 
                   ? 'bg-secondary-fixed/30 border-secondary ring-2 ring-secondary scale-[1.02]' 
                   : 'bg-surface-container-low border-outline-variant/15 hover:border-secondary/50'">
              <span class="material-symbols-outlined mb-3" [class.text-secondary]="form.value.websiteType === 'custom'" [class.text-on-surface-variant]="form.value.websiteType !== 'custom'">draw</span>
              <h3 class="font-headline font-bold text-lg text-on-surface mb-1">Custom Design</h3>
              <p class="text-sm text-on-surface-variant">Bespoke design from the ground up to fit your exact vision.</p>
            </div>

            <div (click)="form.patchValue({websiteType: 'notsure'})"
                 class="p-6 rounded-3xl cursor-pointer transition-all border group relative"
                 [ngClass]="form.value.websiteType === 'notsure' 
                   ? 'bg-secondary-fixed/30 border-secondary ring-2 ring-secondary scale-[1.02]' 
                   : 'bg-surface-container-low border-outline-variant/15 hover:border-secondary/50'">
              <span class="material-symbols-outlined mb-3" [class.text-secondary]="form.value.websiteType === 'notsure'" [class.text-on-surface-variant]="form.value.websiteType !== 'notsure'">help_center</span>
              <h3 class="font-headline font-bold text-lg text-on-surface mb-1">Not Sure</h3>
              <p class="text-sm text-on-surface-variant">Let's discuss and find what works best for your needs.</p>
            </div>

          </div>
          @if (form.controls['websiteType'].invalid && form.controls['websiteType'].touched) {
            <p class="mt-2 text-sm text-error font-medium">Please select a website type</p>
          }
        </div>

        <button type="submit" 
                class="w-full py-4 mt-8 bg-secondary text-on-primary font-bold text-lg rounded-full hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50">
          Continue &rarr;
        </button>
      </form>
    </div>
  `
})
export class StepOneComponent implements OnInit {
  @Output() completed = new EventEmitter<any>();

  form: FormGroup;
  industries = ['Barber', 'Restaurant', 'Salon', 'Gym', 'Clinic', 'Retail', 'Other'];

  constructor(
    private fb: FormBuilder,
    private formStateService: FormStateService,
    private contextService: ContextService
  ) {
    this.form = this.fb.group({
      businessName: ['', Validators.required],
      industry: ['', Validators.required],
      websiteType: ['', Validators.required],
      source: ['direct'],
      templateId: [''],
      serviceId: ['']
    });
  }

  ngOnInit(): void {
    const saved = this.formStateService.getFormData();
    if (saved.businessInfo) {
      this.form.patchValue(saved.businessInfo);
    }
    
    // Auto-select template if arriving from /templates
    const context = this.contextService.getContext();
    if (context && context.source === 'template') {
      if (!this.form.value.websiteType) {
        this.form.patchValue({ websiteType: 'template' });
      }
      this.form.patchValue({
         templateId: context.data['templateId'] || '',
         industry: context.data['industry'] || ''
      });
    }

    // Auto-select custom if arriving from fully managed
    if (context && context.source === 'pricing') {
       if (context.data['tier'] === 'custom' || context.data['tier'] === 'pro') {
          this.form.patchValue({ websiteType: 'custom' });
       } else {
          this.form.patchValue({ websiteType: 'template' });
       }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.completed.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
      // Trigger validation visuals
      Object.keys(this.form.controls).forEach(key => {
        this.form.controls[key].markAsTouched();
      });
    }
  }
}
