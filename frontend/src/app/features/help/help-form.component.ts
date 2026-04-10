import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavComponent } from '../../shared/components/nav/nav.component';

@Component({
  selector: 'app-help-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  template: `
    <div class="min-h-screen bg-surface font-body overflow-hidden flex flex-col">
      <app-nav [navItems]="[]" [activeSection]="''" (linkClick)="goBack()"></app-nav>
      
      <main class="flex-1 max-w-3xl w-full mx-auto px-6 py-20 pb-32 cinematic-reveal">
        
        <button (click)="goBack()" class="flex items-center gap-2 text-on-surface-variant font-semibold hover:text-on-surface transition-colors mb-12">
          <span class="material-symbols-outlined text-lg">arrow_back</span> Back
        </button>

        <h1 class="text-5xl md:text-6xl font-headline font-bold text-on-surface tracking-tight mb-4">
          How can we help?
        </h1>
        <p class="text-xl text-on-surface-variant font-medium mb-12">
          Send us a message and our support team will get back to you within 24 hours.
        </p>

        @if (successMessage) {
          <div class="bg-secondary/10 border border-secondary text-secondary rounded-2xl p-6 mb-8 flex items-start gap-3">
            <span class="material-symbols-outlined text-2xl shrink-0">check_circle</span>
            <div>
              <h3 class="font-bold text-lg">Message Sent</h3>
              <p class="font-medium mt-1">{{ successMessage }}</p>
            </div>
          </div>
        }

        @if (errorMessage) {
          <div class="bg-error/10 text-error rounded-2xl p-4 mb-8 flex items-start gap-3">
            <span class="material-symbols-outlined shrink-0 mt-0.5">error</span>
            <span class="font-medium">{{ errorMessage }}</span>
          </div>
        }

        <form (ngSubmit)="submitHelpRequest()" class="space-y-8">
          
          <!-- Category Pills -->
          <div>
            <label class="block text-sm font-semibold text-on-surface mb-3 pointer-events-none">Topic <span class="text-error">*</span></label>
            <div class="flex flex-wrap gap-3">
              @for (cat of categories; track cat) {
                <button type="button" 
                        (click)="helpForm.subject = cat"
                        class="px-5 py-3 rounded-full text-sm font-semibold transition-all border"
                        [ngClass]="helpForm.subject === cat 
                          ? 'bg-secondary text-on-primary border-secondary shadow-md shadow-secondary/20 scale-[1.02]' 
                          : 'bg-surface-container border-outline-variant/15 text-on-surface hover:bg-surface-container-high'">
                  {{ cat }}
                </button>
              }
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Message <span class="text-error">*</span></label>
            <textarea [(ngModel)]="helpForm.message" name="message" rows="6"
                      class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-none"
                      placeholder="Please provide as much detail as possible so we can assist you better..."></textarea>
          </div>

          <button type="submit" [disabled]="isSubmitting || !helpForm.subject || !helpForm.message"
                  class="w-full py-4 mt-8 bg-secondary text-on-primary font-bold text-lg rounded-full hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
            @if (!isSubmitting) { Send Message }
            @else { 
              <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> 
            }
          </button>
        </form>
      </main>
    </div>
  `
})
export class HelpFormComponent implements OnInit, AfterViewInit {
  private router = inject(Router);

  categories = [
    'Technical Support',
    'Billing Inquiry',
    'Feature Request',
    'Custom Plan Inquiry',
    'General Question'
  ];

  helpForm = {
    subject: '',
    priority: 'medium',
    message: '',
    contactMethod: 'email'
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.cinematic-reveal');
      elements.forEach((el) => {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-6');
      });
    }, 100);
  }

  async submitHelpRequest() {
    if (this.isSubmitting) return;

    if (!this.helpForm.subject || !this.helpForm.message) {
      this.errorMessage = 'Please select a topic and enter a message';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.successMessage = 'Your support request has been routed to the correct team. We will email you back shortly.';
      
      this.helpForm = {
        subject: '',
        priority: 'medium',
        message: '',
        contactMethod: 'email'
      };

      setTimeout(() => {
         this.successMessage = '';
         this.goBack();
      }, 3000);

    } catch (error) {
      this.errorMessage = 'Failed to submit request. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}