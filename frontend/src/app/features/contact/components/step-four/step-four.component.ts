import { Component, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormStateService } from '../../../../core/services/form-state.service';
import { FormStorageService } from '../../../../core/services/form-storage.service';
import { MockApiService } from '../../../../core/services/mock-api.service';
import { ContactFormData } from '../../../../core/models/contact-form.model';

@Component({
  selector: 'app-step-four',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-four.component.html'
})
export class StepFourComponent implements OnInit {
  @Output() completed = new EventEmitter<any>();

  form: FormGroup;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private formStateService: FormStateService,
    private storageService: FormStorageService,
    private apiService: MockApiService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      preferredContact: ['email'],
      bestTimeToReach: ['anytime']
    });
  }

  ngOnInit(): void {
    this.loadSavedData();
  }

  private loadSavedData(): void {
    const saved = this.formStateService.getFormData();
    if (saved.contactInfo) {
      this.form.patchValue(saved.contactInfo);
    }
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      
      // Combine all form data
      const formData = this.formStateService.getFormData();
      const completeData: ContactFormData = {
        ...formData,
        contactInfo: this.form.value,
        metadata: {
          ...formData.metadata!,
          completedAt: new Date()
        }
      } as ContactFormData;

      // Submit to mock API
      this.apiService.submitForm(completeData).subscribe({
        next: (response) => {
          console.log('Form submitted successfully:', response);
          this.storageService.saveSubmission(completeData);
          this.storageService.clearProgress();
          this.completed.emit(this.form.value);
          this.isSubmitting.set(false);
        },
        error: (error) => {
          console.error('Submission error:', error);
          this.isSubmitting.set(false);
          alert('There was an error submitting your form. Please try again.');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
