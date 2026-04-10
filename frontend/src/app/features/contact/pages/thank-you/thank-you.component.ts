import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormStorageService } from '../../../../core/services/form-storage.service';
import { FormStateService } from '../../../../core/services/form-state.service';
import { NavComponent } from '../../../../shared/components/nav/nav.component';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, NavComponent],
  template: `
    <div class="min-h-screen bg-surface font-body overflow-hidden flex flex-col">
      <app-nav [navItems]="[]" [activeSection]="''" (linkClick)="goHome()"></app-nav>
      
      <main class="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <!-- Ambient Background glow -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div class="max-w-xl w-full text-center relative z-10 cinematic-reveal">
          
          <!-- Animated Checkmark -->
          <div class="w-32 h-32 mx-auto mb-8 bg-surface-container-lowest rounded-full flex items-center justify-center border-4 border-secondary/20 shadow-2xl shadow-secondary/10 relative">
            <svg class="w-16 h-16 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path class="animate-[draw_0.5s_ease-out_forwards]" stroke-dasharray="30" stroke-dashoffset="30" d="M20 6L9 17l-5-5"></path>
            </svg>
            <div class="absolute inset-0 rounded-full border-4 border-secondary animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
          </div>

          <h1 class="text-4xl lg:text-5xl font-headline font-bold text-on-surface mb-6">
            Project Received
          </h1>
          <p class="text-xl text-on-surface-variant font-medium mb-12">
            Thank you {{ contactName }}. We've got all the details and are reviewing your inquiry right now.
          </p>

          <!-- Vertical Timeline Strip -->
          <div class="max-w-sm mx-auto text-left relative pl-10 mb-12">
             <div class="absolute left-3 top-2 bottom-2 w-0.5 bg-outline-variant/30 hidden md:block"></div>
             
             <div class="relative mb-8 cinematic-reveal" style="transition-delay: 200ms">
                <div class="absolute -left-[35px] w-6 h-6 rounded-full bg-secondary text-on-primary flex items-center justify-center shadow-lg">
                   <span class="material-symbols-outlined text-[12px]">done</span>
                </div>
                <h3 class="font-bold text-on-surface">Details received</h3>
                <p class="text-sm text-on-surface-variant mt-1">Your answers have reached our desk safely.</p>
             </div>

             <div class="relative mb-8 cinematic-reveal" style="transition-delay: 300ms">
                <div class="absolute -left-[35px] w-6 h-6 rounded-full bg-surface-container border-2 border-secondary text-secondary flex items-center justify-center animate-pulse">
                   <span class="w-2 h-2 bg-secondary rounded-full"></span>
                </div>
                <h3 class="font-bold text-on-surface">Under review</h3>
                <p class="text-sm text-on-surface-variant mt-1">Our project managers are analyzing your requirements.</p>
             </div>

             <div class="relative cinematic-reveal" style="transition-delay: 400ms">
                <div class="absolute -left-[35px] w-6 h-6 rounded-full bg-surface-container border-2 border-outline-variant/30 flex items-center justify-center"></div>
                <h3 class="font-bold text-on-surface-variant">We'll reach out</h3>
                <p class="text-sm text-on-surface-variant mt-1">Expect an email or call within 24 hours.</p>
             </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center cinematic-reveal" style="transition-delay: 600ms">
            <button (click)="goHome()" class="px-8 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-full font-bold text-on-surface hover:bg-surface-container transition-all active:scale-95 text-lg">
              Return Home
            </button>
            <button (click)="viewTemplates()" class="px-8 py-4 bg-secondary text-on-primary rounded-full font-bold hover:bg-secondary-container transition-all active:scale-95 text-lg shadow-lg shadow-secondary/20">
              Browse More Templates
            </button>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    @keyframes draw {
      to { stroke-dashoffset: 0; }
    }
  `]
})
export class ThankYouComponent implements OnInit, AfterViewInit {
  contactName: string = '';

  constructor(
    private router: Router,
    private storageService: FormStorageService,
    private formStateService: FormStateService
  ) {}

  ngOnInit(): void {
    const submissions = this.storageService.getSubmissions();
    if (submissions.length > 0) {
      const lastSubmission = submissions[submissions.length - 1];
      this.contactName = lastSubmission.contactInfo?.name?.split(' ')[0] || '';
    }
    this.formStateService.resetForm();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.cinematic-reveal');
      elements.forEach((el, index) => {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-6');
      });
    }, 100);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  viewTemplates(): void {
    this.router.navigate(['/templates']);
  }
}
