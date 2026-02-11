import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sticky-cta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sticky-cta-bar fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-300 ease-in-out"
         [class.translate-y-0]="isVisible"
         [class.translate-y-full]="!isVisible">
      
      <div class="cta-container bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 shadow-2xl">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between gap-4">
            
            <!-- CTA Content -->
            <div class="cta-content flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <div class="cta-icon animate-bounce">
                  <span class="material-symbols-outlined text-2xl text-white">{{ currentCTA.icon }}</span>
                </div>
                <div class="cta-text">
                  <p class="text-white font-bold text-lg leading-tight">
                    {{ currentCTA.title }}
                  </p>
                  <p class="text-blue-100 text-sm hidden sm:block">
                    {{ currentCTA.subtitle }}
                  </p>
                </div>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="cta-buttons flex items-center gap-3">
              <button (click)="onPrimaryAction()"
                      class="primary-btn bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap">
                {{ currentCTA.primaryButton }}
              </button>
              
              <button (click)="onSecondaryAction()"
                      class="secondary-btn hidden sm:block border-2 border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 whitespace-nowrap">
                {{ currentCTA.secondaryButton }}
              </button>
              
              <!-- Close Button -->
              <button (click)="dismiss()"
                      class="close-btn text-white hover:text-blue-200 transition-colors duration-200 p-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Progress Bar (for urgency) -->
        <div *ngIf="currentCTA.showProgress" class="progress-container">
          <div class="progress-bar h-1 bg-blue-800">
            <div class="progress-fill h-full bg-white transition-all duration-1000 ease-linear"
                 [style.width.%]="progressWidth"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sticky-cta-bar {
      backdrop-filter: blur(10px);
    }

    .cta-container {
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    }

    .primary-btn {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .primary-btn:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .cta-icon {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    /* Mobile optimizations */
    @media (max-width: 640px) {
      .cta-content .cta-text p:first-child {
        font-size: 1rem;
      }
      
      .primary-btn {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
      }
    }

    /* Animation for progress bar */
    .progress-fill {
      animation: progressAnimation 30s linear;
    }

    @keyframes progressAnimation {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
  `]
})
export class StickyCTAComponent implements OnInit, OnDestroy {
  isVisible = false;
  progressWidth = 100;
  private scrollThreshold = 300;
  private isDismissed = false;
  private currentCTAIndex = 0;
  private ctaTimer: any;
  private progressTimer: any;

  ctaVariations = [
    {
      icon: 'rocket_launch',
      title: 'Ready to transform your business?',
      subtitle: 'Get a professional website in just 14 days',
      primaryButton: 'Start Your Project',
      secondaryButton: 'Get Quote',
      showProgress: false
    },
    {
      icon: 'local_offer',
      title: 'Limited Time: 20% Off All Packages',
      subtitle: 'Save hundreds on your new website this month',
      primaryButton: 'Claim Discount',
      secondaryButton: 'Learn More',
      showProgress: true
    },
    {
      icon: 'call',
      title: 'Free Consultation Available',
      subtitle: 'Speak with our experts about your project',
      primaryButton: 'Book Call',
      secondaryButton: 'Chat Now',
      showProgress: false
    },
    {
      icon: 'speed',
      title: 'Fast Track Your Website',
      subtitle: 'Launch in 7 days with our express service',
      primaryButton: 'Go Express',
      secondaryButton: 'Learn How',
      showProgress: false
    }
  ];

  get currentCTA() {
    return this.ctaVariations[this.currentCTAIndex];
  }

  constructor(private router: Router) {}

  ngOnInit() {
    // Check if user has dismissed the CTA
    this.isDismissed = localStorage.getItem('sticky-cta-dismissed') === 'true';
    
    if (!this.isDismissed) {
      // Start rotating CTAs every 15 seconds
      this.startCTARotation();
    }
  }

  ngOnDestroy() {
    if (this.ctaTimer) {
      clearInterval(this.ctaTimer);
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isDismissed) return;

    const scrollPosition = window.pageYOffset;
    const shouldShow = scrollPosition > this.scrollThreshold;
    
    if (shouldShow !== this.isVisible) {
      this.isVisible = shouldShow;
    }
  }

  private startCTARotation() {
    this.ctaTimer = setInterval(() => {
      this.rotateCTA();
    }, 15000); // Change CTA every 15 seconds

    // Start progress animation for CTAs that have it
    this.startProgressAnimation();
  }

  private rotateCTA() {
    this.currentCTAIndex = (this.currentCTAIndex + 1) % this.ctaVariations.length;
    this.startProgressAnimation();
  }

  private startProgressAnimation() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }

    if (this.currentCTA.showProgress) {
      this.progressWidth = 100;
      
      this.progressTimer = setInterval(() => {
        this.progressWidth -= 100 / 300; // 30 seconds total
        if (this.progressWidth <= 0) {
          clearInterval(this.progressTimer);
        }
      }, 100);
    }
  }

  onPrimaryAction() {
    // Track the action
    this.trackCTAClick('primary', this.currentCTA.primaryButton);

    // Navigate based on CTA type
    switch (this.currentCTA.primaryButton) {
      case 'Start Your Project':
      case 'Claim Discount':
      case 'Go Express':
        this.router.navigate(['/contact']);
        break;
      case 'Book Call':
        // Open calendar booking
        window.open('https://calendly.com/ariesventures', '_blank');
        break;
      default:
        this.router.navigate(['/contact']);
    }
  }

  onSecondaryAction() {
    // Track the action
    this.trackCTAClick('secondary', this.currentCTA.secondaryButton);

    // Navigate based on CTA type
    switch (this.currentCTA.secondaryButton) {
      case 'Get Quote':
      case 'Learn More':
      case 'Learn How':
        this.router.navigate(['/pricing']);
        break;
      case 'Chat Now':
        // Trigger live chat
        this.openLiveChat();
        break;
      default:
        this.router.navigate(['/pricing']);
    }
  }

  dismiss() {
    this.isVisible = false;
    this.isDismissed = true;
    
    // Remember dismissal for 24 hours
    localStorage.setItem('sticky-cta-dismissed', 'true');
    setTimeout(() => {
      localStorage.removeItem('sticky-cta-dismissed');
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Clear timers
    if (this.ctaTimer) {
      clearInterval(this.ctaTimer);
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }

    // Track dismissal
    this.trackCTAClick('dismiss', 'close');
  }

  private trackCTAClick(type: string, button: string) {
    // Analytics tracking
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'sticky_cta_click', {
        'cta_type': type,
        'button_text': button,
        'cta_variation': this.currentCTAIndex
      });
    }

    // You can also send to your analytics service
    console.log(`Sticky CTA clicked: ${type} - ${button}`);
  }

  private openLiveChat() {
    // Integrate with your live chat service
    // For example, Tawk.to:
    if (typeof (window as any).Tawk_API !== 'undefined') {
      (window as any).Tawk_API.toggle();
    } else {
      // Fallback to contact form
      this.router.navigate(['/contact']);
    }
  }
}