import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NavComponent } from '../shared/components/nav/nav.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  template: `
    <div class="min-h-screen bg-surface font-body overflow-hidden flex flex-col">
      <!-- Top bar -->
      <app-nav [navItems]="[]" [activeSection]="''" (linkClick)="skip()"></app-nav>

      <!-- Progress bar -->
      <div class="fixed top-[72px] left-0 w-full h-1 bg-surface-container z-20">
        <div class="h-full bg-secondary transition-all duration-500" [style.width.%]="progress"></div>
      </div>

      <main class="flex-1 max-w-4xl w-full mx-auto px-6 py-20 pb-32">
        
        <!-- Step indicator -->
        <div class="flex items-center gap-3 mb-10 cinematic-reveal">
          <span class="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Step {{ currentStep }} of {{ totalSteps }}</span>
          <div class="flex gap-1.5 ml-2">
            <div *ngFor="let s of [1,2,3,4]"
                 class="h-1.5 w-8 rounded-full transition-all duration-300"
                 [class]="s <= currentStep ? 'bg-secondary' : 'bg-surface-container-high'"></div>
          </div>
        </div>

        <!-- STEP 1: Business type -->
        <div *ngIf="currentStep === 1" class="cinematic-reveal">
          <h1 class="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight mb-4">
            What type of business are you?
          </h1>
          <p class="text-xl text-on-surface-variant font-medium mb-12">We'll tailor your recommendations to your industry.</p>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <button *ngFor="let type of businessTypes"
                    (click)="selectBusinessType(type.id)"
                    class="flex flex-col items-center justify-center p-8 rounded-3xl transition-all border-2 group relative overflow-hidden"
                    [class]="data.businessType === type.id
                      ? 'border-secondary bg-secondary-fixed/50 scale-[1.02] shadow-lg shadow-secondary/10'
                      : 'border-outline-variant/15 bg-surface-container-lowest hover:border-secondary/50'">
              <span class="material-symbols-outlined text-4xl mb-4 transition-colors duration-300"
                    [class]="data.businessType === type.id ? 'text-secondary font-bold' : 'text-on-surface-variant group-hover:text-secondary'">
                {{ type.icon }}
              </span>
              <span class="font-headline text-lg font-bold transition-colors duration-300"
                    [class]="data.businessType === type.id ? 'text-on-surface' : 'text-on-surface-variant'">
                {{ type.label }}
              </span>
            </button>
          </div>

          <div class="flex justify-between items-center z-10">
            <div></div> <!-- Empty for flex alignment -->
            <button (click)="next()" [disabled]="!data.businessType"
                    class="px-8 py-4 bg-secondary text-on-primary rounded-full font-bold text-lg hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2">
              Next Step <span class="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- STEP 2: Goal -->
        <div *ngIf="currentStep === 2" class="cinematic-reveal">
          <h1 class="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight mb-4">
            What's your main goal?
          </h1>
          <p class="text-xl text-on-surface-variant font-medium mb-12">This helps us focus on what matters most for your website.</p>

          <div class="space-y-4 mb-12">
            <button *ngFor="let goal of goals"
                    (click)="selectGoal(goal.id)"
                    class="w-full flex items-center gap-6 p-6 rounded-3xl transition-all border-2 group relative overflow-hidden"
                    [class]="data.goal === goal.id
                      ? 'border-secondary bg-secondary-fixed/50 scale-[1.02] shadow-lg shadow-secondary/10'
                      : 'border-outline-variant/15 bg-surface-container-lowest hover:border-secondary/50'">
              <div class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                   [class]="data.goal === goal.id ? 'bg-secondary text-on-primary' : 'bg-surface-container text-on-surface-variant'">
                <span class="material-symbols-outlined text-2xl">{{ goal.icon }}</span>
              </div>
              <span class="text-xl font-headline font-bold transition-colors"
                    [class]="data.goal === goal.id ? 'text-on-surface' : 'text-on-surface-variant'">
                {{ goal.label }}
              </span>
              <span class="material-symbols-outlined ml-auto text-2xl transition-all duration-300"
                    [ngClass]="data.goal === goal.id ? 'opacity-100 text-secondary scale-100' : 'opacity-0 scale-50'">
                check_circle
              </span>
            </button>
          </div>

          <div class="flex justify-between items-center z-10">
            <button (click)="back()" class="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-on-surface hover:bg-surface-container transition-all active:scale-95">
               <span class="material-symbols-outlined">arrow_back</span> Back
            </button>
            <button (click)="next()" [disabled]="!data.goal"
                    class="px-8 py-4 bg-secondary text-on-primary rounded-full font-bold text-lg hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2">
              Next Step <span class="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- STEP 3: Features -->
        <div *ngIf="currentStep === 3" class="cinematic-reveal">
          <h1 class="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight mb-4">
            Which features do you need?
          </h1>
          <p class="text-xl text-on-surface-variant font-medium mb-12">Select everything that applies. You can always add more later.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <button *ngFor="let feature of featureOptions"
                    (click)="toggleFeature(feature.id)"
                    class="flex items-center gap-4 p-5 rounded-2xl transition-all border text-left group"
                    [class]="hasFeature(feature.id)
                      ? 'border-secondary bg-secondary-fixed/50 shadow-sm'
                      : 'border-outline-variant/15 bg-surface-container-lowest hover:border-secondary/50'">
              <div class="w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                   [class]="hasFeature(feature.id) ? 'border-secondary bg-secondary' : 'border-outline-variant/30'">
                <span *ngIf="hasFeature(feature.id)" class="material-symbols-outlined text-on-primary text-sm font-bold">check</span>
              </div>
              <span class="text-lg font-semibold transition-colors"
                    [class]="hasFeature(feature.id) ? 'text-on-surface' : 'text-on-surface-variant'">{{ feature.label }}</span>
            </button>
          </div>

          <div class="flex justify-between items-center z-10">
            <button (click)="back()" class="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-on-surface hover:bg-surface-container transition-all active:scale-95">
               <span class="material-symbols-outlined">arrow_back</span> Back
            </button>
            <button (click)="next()" [disabled]="data.features.length === 0"
                    class="px-8 py-4 bg-secondary text-on-primary rounded-full font-bold text-lg hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2">
              Next Step <span class="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- STEP 4: Summary CTA -->
        <div *ngIf="currentStep === 4" class="cinematic-reveal">
          
          <div class="text-center mb-10">
            <div class="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mx-auto mb-6 shadow-2xl shadow-secondary/20">
              <span class="material-symbols-outlined text-4xl">celebration</span>
            </div>
            <h1 class="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight mb-4">
              You're all set!
            </h1>
            <p class="text-xl text-on-surface-variant font-medium">We have everything we need to prepare your quote.</p>
          </div>
          
          <!-- Summary card -->
          <div *ngIf="data.businessType && data.goal" class="bg-surface-container-lowest border border-outline-variant/10 shadow-sm rounded-3xl p-8 mb-12 max-w-xl mx-auto cinematic-reveal" style="transition-delay: 100ms">
            <h3 class="font-headline font-bold text-on-surface mb-6 text-xl">Project Summary</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between pb-4 border-b border-outline-variant/10">
                <span class="text-on-surface-variant font-medium">Business type</span>
                <span class="font-bold text-on-surface capitalize">{{ getBusinessLabel(data.businessType) }}</span>
              </div>
              <div class="flex items-center justify-between pb-4 border-b border-outline-variant/10">
                <span class="text-on-surface-variant font-medium">Main goal</span>
                <span class="font-bold text-on-surface capitalize">{{ getGoalLabel(data.goal) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-on-surface-variant font-medium">Requested features</span>
                <span class="font-bold text-on-surface">{{ data.features.length }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto cinematic-reveal" style="transition-delay: 200ms">
            <button (click)="back()" class="px-8 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-full font-bold text-on-surface hover:bg-surface-container transition-all active:scale-95 text-lg">
              Review Answers
            </button>
            <button (click)="finish()"
                    class="px-8 py-4 bg-secondary text-on-primary rounded-full font-bold text-lg hover:bg-secondary-container transition-all active:scale-95 flex-1 shadow-lg shadow-secondary/20 flex items-center justify-center gap-2">
              Continue to Quote <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  `
})
export class OnboardingComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentStep = 1;
  totalSteps = 4;

  data = {
    businessType: '',
    businessName: '',
    website: '',
    goal: '',
    budget: '',
    timeline: '',
    features: [] as string[],
    phone: ''
  };

  businessTypes = [
    { id: 'barbershop', label: 'Barbershop', icon: 'content_cut' },
    { id: 'restaurant', label: 'Restaurant / Café', icon: 'restaurant' },
    { id: 'salon', label: 'Salon / Beauty', icon: 'spa' },
    { id: 'retail', label: 'Retail / Shop', icon: 'storefront' },
    { id: 'trades', label: 'Trades / Services', icon: 'home_repair_service' },
    { id: 'other', label: 'Other', icon: 'business_center' }
  ];

  goals = [
    { id: 'leads', label: 'Get more leads', icon: 'trending_up' },
    { id: 'bookings', label: 'Take online bookings', icon: 'calendar_month' },
    { id: 'presence', label: 'Build online presence', icon: 'language' },
    { id: 'sales', label: 'Sell products online', icon: 'shopping_cart' }
  ];

  featureOptions = [
    { id: 'booking', label: 'Online booking' },
    { id: 'gallery', label: 'Photo gallery' },
    { id: 'menu', label: 'Menu / price list' },
    { id: 'map', label: 'Google Maps' },
    { id: 'seo', label: 'SEO setup' },
    { id: 'blog', label: 'Blog / news' }
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    this.triggerCinematicReveal();
  }

  triggerCinematicReveal() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.cinematic-reveal');
      elements.forEach(el => {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-6');
      });
    }, 10);
  }

  getBusinessLabel(id: string) { return this.businessTypes.find(t => t.id === id)?.label || id; }
  getGoalLabel(id: string) { return this.goals.find(g => g.id === id)?.label || id; }

  selectBusinessType(id: string) { this.data.businessType = id; }
  selectGoal(id: string) { this.data.goal = id; }

  toggleFeature(id: string) {
    const idx = this.data.features.indexOf(id);
    if (idx > -1) this.data.features.splice(idx, 1);
    else this.data.features.push(id);
  }

  hasFeature(id: string) { return this.data.features.includes(id); }

  next() { 
    if (this.currentStep < this.totalSteps) {
       this.currentStep++; 
       this.triggerCinematicReveal();
    }
  }
  
  back() { 
    if (this.currentStep > 1) {
       this.currentStep--; 
       this.triggerCinematicReveal();
    }
  }

  skip() { this.router.navigate(['/dashboard']); }

  finish() { this.router.navigate(['/contact']); }

  get progress() { return (this.currentStep / this.totalSteps) * 100; }
}
