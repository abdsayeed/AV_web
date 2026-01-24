import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormStorageService } from '../../../../core/services/form-storage.service';
import { ContactFormData } from '../../../../core/models/contact-form.model';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div class="max-w-2xl w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
          
          <!-- Success Icon -->
          <div class="mb-6 flex justify-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>

          <!-- Thank You Message -->
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🎉 Thank You{{ contactName ? ', ' + contactName : '' }}!
          </h1>
          
          <p class="text-lg text-gray-600 mb-6">
            Your project inquiry has been received successfully.
          </p>

          @if (referenceNumber) {
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p class="text-sm text-gray-600 mb-1">Reference Number</p>
              <p class="text-2xl font-bold text-blue-600">{{ referenceNumber }}</p>
            </div>
          }

          <!-- What's Next -->
          <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">📋 What happens next?</h2>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <span class="text-2xl">✅</span>
                <div>
                  <p class="font-medium text-gray-900">We'll review your requirements</p>
                  <p class="text-sm text-gray-600">Our team will carefully analyze your project needs</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-2xl">📧</span>
                <div>
                  <p class="font-medium text-gray-900">Expect a response within 24 hours</p>
                  <p class="text-sm text-gray-600">We'll reach out via your preferred contact method</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-2xl">💬</span>
                <div>
                  <p class="font-medium text-gray-900">Schedule a consultation</p>
                  <p class="text-sm text-gray-600">We'll discuss your project in detail and provide a custom quote</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              (click)="goHome()"
              class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              🏠 Back to Home
            </button>
            <button
              (click)="viewTemplates()"
              class="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
              👁️ Browse Templates
            </button>
          </div>

          <!-- Social Links -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-3">Follow us for updates and tips</p>
            <div class="flex justify-center gap-4">
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <span class="text-2xl">📘</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <span class="text-2xl">🐦</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <span class="text-2xl">📷</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <span class="text-2xl">💼</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ThankYouComponent implements OnInit {
  contactName: string = '';
  referenceNumber: string = '';

  constructor(
    private router: Router,
    private storageService: FormStorageService
  ) {}

  ngOnInit(): void {
    this.loadSubmissionData();
  }

  private loadSubmissionData(): void {
    const submissions = this.storageService.getSubmissions();
    if (submissions.length > 0) {
      const lastSubmission = submissions[submissions.length - 1];
      this.contactName = lastSubmission.contactInfo?.name || '';
      this.referenceNumber = lastSubmission.metadata?.submissionId || '';
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  viewTemplates(): void {
    this.router.navigate(['/'], { fragment: 'templates' });
  }
}
