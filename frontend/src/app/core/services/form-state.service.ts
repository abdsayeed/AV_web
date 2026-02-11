import { Injectable, signal } from '@angular/core';
import { ContactFormData } from '../models/contact-form.model';
import { FormStorageService } from './form-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  // Using Angular Signals for reactive state
  private formData = signal<Partial<ContactFormData>>(this.getInitialFormData());
  private currentStep = signal<number>(1);
  
  // Public readonly signals
  readonly formData$ = this.formData.asReadonly();
  readonly currentStep$ = this.currentStep.asReadonly();

  constructor(private storageService: FormStorageService) {
    this.loadSavedProgress();
  }

  private getInitialFormData(): Partial<ContactFormData> {
    return {
      metadata: {
        startedAt: new Date(),
        currentStep: 1
      }
    };
  }

  updateFormData(step: keyof ContactFormData, data: any): void {
    this.formData.update(current => ({
      ...current,
      [step]: data,
      metadata: {
        ...current.metadata!,
        lastSavedAt: new Date()
      }
    }));
    this.storageService.saveProgress(this.formData());
  }

  goToStep(step: number): void {
    this.currentStep.set(step);
    this.updateFormData('metadata', {
      ...this.formData().metadata,
      currentStep: step
    });
  }

  nextStep(): void {
    const current = this.currentStep();
    if (current < 4) {
      this.goToStep(current + 1);
    }
  }

  previousStep(): void {
    const current = this.currentStep();
    if (current > 1) {
      this.goToStep(current - 1);
    }
  }

  loadSavedProgress(): void {
    const saved = this.storageService.getProgress();
    if (saved) {
      this.formData.set(saved);
      this.currentStep.set(saved.metadata?.currentStep || 1);
    }
  }

  resetForm(): void {
    this.formData.set(this.getInitialFormData());
    this.currentStep.set(1);
    this.storageService.clearProgress();
  }

  getFormData(): Partial<ContactFormData> {
    return this.formData();
  }
}
