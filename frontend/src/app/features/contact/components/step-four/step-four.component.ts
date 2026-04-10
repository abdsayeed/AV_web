import { Component, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormStateService } from '../../../../core/services/form-state.service';
import { FormStorageService } from '../../../../core/services/form-storage.service';
import { ApiService } from '../../../../core/services/api.service';
import { ContactFormData } from '../../../../core/models/contact-form.model';

@Component({
  selector: 'app-step-four',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cinematic-reveal">
      <h2 class="text-3xl font-headline font-bold text-on-surface mb-2">Let's get in touch</h2>
      <p class="text-on-surface-variant mb-10">We'll review your project details and get back to you within 24 hours.</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Full Name <span class="text-error">*</span></label>
            <input type="text" formControlName="name"
                   class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                   placeholder="Your full name">
            @if (form.controls['name'].invalid && form.controls['name'].touched) {
              <p class="mt-2 text-sm text-error font-medium">Name is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Email Address <span class="text-error">*</span></label>
            <input type="email" formControlName="email"
                   class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                   placeholder="name@business.com">
            @if (form.controls['email'].invalid && form.controls['email'].touched) {
              <p class="mt-2 text-sm text-error font-medium">Valid email is required</p>
            }
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Phone Number</label>
          <input type="tel" formControlName="phone"
                 class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                 placeholder="+44 7000 000000">
        </div>

        <div>
          <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Message</label>
          <textarea formControlName="message" rows="4"
                    class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-none"
                    placeholder="Anything else we should know?"></textarea>
        </div>

        <button type="submit" [disabled]="isSubmitting() || form.invalid"
                class="w-full py-4 mt-8 bg-secondary text-on-primary font-bold text-lg rounded-full hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-secondary/20">
          @if (!isSubmitting()) { 
             Submit Project <span class="material-symbols-outlined ml-1">send</span> 
          }
          @else { 
            <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> 
            Sending...
          }
        </button>
      </form>
    </div>
  `
})
export class StepFourComponent implements OnInit {
  @Output() completed = new EventEmitter<any>();

  form: FormGroup;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private formStateService: FormStateService,
    private storageService: FormStorageService,
    private apiService: ApiService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['']
    });
  }

  ngOnInit(): void {
    const saved = this.formStateService.getFormData();
    if (saved.contactInfo) {
      this.form.patchValue(saved.contactInfo);
    }
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      
      const formData = this.formStateService.getFormData();
      const completeData: ContactFormData = {
        ...formData,
        contactInfo: this.form.value,
        metadata: {
          ...formData.metadata!,
          completedAt: new Date()
        }
      } as ContactFormData;

      this.apiService.submitContactForm(completeData).subscribe({
        next: (response) => {
          this.storageService.saveSubmission(completeData);
          this.storageService.clearProgress();
          this.completed.emit(this.form.value);
          this.isSubmitting.set(false);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          const errorMessage = error.error?.message || 'There was an error submitting your form. Please try again.';
          alert(errorMessage);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
