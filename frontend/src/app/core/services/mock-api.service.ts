import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactFormData } from '../models/contact-form.model';
import { ApiService, ContactSubmissionResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  constructor(private apiService: ApiService) {}

  submitForm(data: ContactFormData): Observable<{ success: boolean; referenceNumber: string; message: string }> {
    return this.apiService.submitContactForm(data).pipe(
      map((response: ContactSubmissionResponse) => ({
        success: response.success,
        referenceNumber: response.referenceNumber,
        message: response.message
      }))
    );
  }

  validateEmail(email: string): Observable<{ valid: boolean; suggestion?: string }> {
    return this.apiService.validateEmail(email);
  }
}
