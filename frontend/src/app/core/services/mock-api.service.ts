import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ContactFormData } from '../models/contact-form.model';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  // Simulate API calls with delays

  submitForm(data: ContactFormData): Observable<{ success: boolean; referenceNumber: string; message: string }> {
    return of({
      success: true,
      referenceNumber: this.generateReferenceNumber(),
      message: 'Your inquiry has been received successfully!'
    }).pipe(delay(1500)); // Simulate network delay
  }

  validateEmail(email: string): Observable<{ valid: boolean; suggestion?: string }> {
    // Basic email validation with domain suggestions
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const emailParts = email.split('@');
    
    if (emailParts.length !== 2) {
      return of({ valid: false }).pipe(delay(300));
    }

    const [, domain] = emailParts;
    const suggestion = this.findClosestDomain(domain, commonDomains);

    return of({
      valid: true,
      suggestion: suggestion !== domain ? suggestion : undefined
    }).pipe(delay(300));
  }

  private generateReferenceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `AV-${year}-${random}`;
  }

  private findClosestDomain(input: string, domains: string[]): string {
    // Simple Levenshtein distance implementation
    const getDistance = (a: string, b: string): number => {
      const matrix: number[][] = [];

      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }

      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }

      return matrix[b.length][a.length];
    };

    let closest = input;
    let minDistance = Infinity;

    for (const domain of domains) {
      const distance = getDistance(input.toLowerCase(), domain);
      if (distance < minDistance && distance <= 2) {
        minDistance = distance;
        closest = domain;
      }
    }

    return closest;
  }
}
