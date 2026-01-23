import { Injectable } from '@angular/core';
import { ContactFormData } from '../models/contact-form.model';

@Injectable({
  providedIn: 'root'
})
export class FormStorageService {
  private readonly PROGRESS_KEY = 'contact_form_progress';
  private readonly SUBMISSIONS_KEY = 'contact_form_submissions';

  saveProgress(data: Partial<ContactFormData>): void {
    try {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  getProgress(): Partial<ContactFormData> | null {
    try {
      const stored = localStorage.getItem(this.PROGRESS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  }

  clearProgress(): void {
    localStorage.removeItem(this.PROGRESS_KEY);
  }

  saveSubmission(data: ContactFormData): void {
    try {
      const submissions = this.getSubmissions();
      submissions.push({
        ...data,
        metadata: {
          ...data.metadata,
          submissionId: this.generateSubmissionId(),
          completedAt: new Date()
        }
      });
      localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(submissions));
    } catch (error) {
      console.error('Failed to save submission:', error);
    }
  }

  getSubmissions(): ContactFormData[] {
    try {
      const stored = localStorage.getItem(this.SUBMISSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load submissions:', error);
      return [];
    }
  }

  private generateSubmissionId(): string {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `AV-${year}-${random}`;
  }
}
