import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guided-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-surface font-body overflow-hidden flex flex-col lg:flex-row">
      <!-- Left side: Form Panel (55%) -->
      <div class="w-full lg:w-[55%] flex flex-col relative z-10 bg-surface min-h-[50vh] lg:min-h-screen">
        
        <!-- Top Nav -->
        <div class="px-8 py-6 flex items-center justify-between border-b border-outline-variant/10 bg-surface">
          <div class="flex items-center gap-3 cursor-pointer" (click)="skip()">
            <div class="w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg shadow-secondary/20">
              <span class="material-symbols-outlined text-white text-sm">rocket_launch</span>
            </div>
            <span class="font-headline font-bold tracking-tight text-on-surface">Guided Setup</span>
          </div>
          <button (click)="skip()" class="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest">
            Exit
          </button>
        </div>

        <!-- Progress Track -->
        <div class="px-8 py-4 border-b border-outline-variant/10 bg-surface-container-lowest flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <div *ngFor="let label of stepLabels; let i = index" class="flex items-center flex-shrink-0">
             <div class="flex items-center gap-2" [class.opacity-50]="i + 1 > currentStep">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                     [ngClass]="i + 1 === currentStep ? 'bg-secondary text-white' : (i + 1 < currentStep ? 'bg-secondary/20 text-secondary' : 'bg-surface-container-high text-on-surface-variant')">
                   <ng-container *ngIf="i + 1 < currentStep; else showNum">
                      <span class="material-symbols-outlined text-[14px]">check</span>
                   </ng-container>
                   <ng-template #showNum>{{ i + 1 }}</ng-template>
                </div>
                <span class="font-semibold text-sm" [ngClass]="i + 1 === currentStep ? 'text-on-surface' : 'text-on-surface-variant'">{{ label }}</span>
             </div>
             <div *ngIf="i < stepLabels.length - 1" class="w-8 h-px bg-outline-variant/30 mx-3"></div>
          </div>
        </div>

        <!-- Scrollable Form Area -->
        <div class="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div class="max-w-2xl mx-auto">

            <!-- STEP 1: Basic Info -->
            <div *ngIf="currentStep === 1" class="cinematic-reveal">
              <h1 class="text-3xl lg:text-4xl font-headline font-bold text-on-surface mb-2">Tell us about your business</h1>
              <p class="text-on-surface-variant mb-10 text-lg">Let's start with the essentials to build your foundation.</p>

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-semibold text-on-surface mb-2">Business Name</label>
                  <input type="text" [(ngModel)]="data.businessName"
                         class="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                         placeholder="e.g. Aries Grooming">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-on-surface mb-2">Industry</label>
                  <select [(ngModel)]="data.industry"
                          class="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all appearance-none">
                    <option value="" disabled>Select an industry...</option>
                    <option *ngFor="let ind of industries" [value]="ind">{{ ind }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-on-surface mb-2">Short Description</label>
                  <textarea [(ngModel)]="data.description" rows="3"
                         class="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-none"
                         placeholder="What makes you unique?"></textarea>
                </div>
              </div>
            </div>

            <!-- STEP 2: Template & Theme -->
            <div *ngIf="currentStep === 2" class="cinematic-reveal">
               <h1 class="text-3xl lg:text-4xl font-headline font-bold text-on-surface mb-2">Choose your starting point</h1>
               <p class="text-on-surface-variant mb-10 text-lg">Select a layout and your brand's primary color.</p>

               <div class="mb-8">
                 <label class="block text-sm font-semibold text-on-surface mb-4">Brand Color</label>
                 <div class="flex gap-4">
                   <button *ngFor="let c of colors" (click)="selectColor(c)"
                           class="w-12 h-12 rounded-full flex items-center justify-center transition-all border-4"
                           [style.backgroundColor]="c"
                           [ngClass]="data.primaryColor === c ? 'border-white shadow-lg scale-110' : 'border-transparent hover:scale-105'">
                     <span *ngIf="data.primaryColor === c" class="material-symbols-outlined text-white text-sm drop-shadow-md">check</span>
                   </button>
                 </div>
               </div>

               <div>
                 <label class="block text-sm font-semibold text-on-surface mb-4">Layout Theme</label>
                 <div class="grid grid-cols-2 gap-4">
                   <div *ngFor="let t of templates" (click)="selectTemplate(t.id)"
                        class="border-2 rounded-2xl p-2 cursor-pointer transition-all bg-surface-container-lowest"
                        [ngClass]="data.templateId === t.id ? 'border-secondary bg-secondary-fixed/30 shadow-md' : 'border-outline-variant/15 hover:border-secondary/50'">
                     <!-- Abstract representation since we might not have actual assets -->
                     <div class="w-full aspect-video bg-surface-container rounded-xl flex items-center justify-center overflow-hidden relative">
                         <div class="absolute inset-0 opacity-10" [style.backgroundColor]="data.primaryColor"></div>
                         <span class="font-headline font-bold text-on-surface-variant text-sm z-10">{{ t.name }}</span>
                     </div>
                     <div class="p-3 text-center font-semibold text-sm text-on-surface">
                       {{ t.name }}
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <!-- STEP 3: Content Structure -->
            <div *ngIf="currentStep === 3" class="cinematic-reveal">
               <h1 class="text-3xl lg:text-4xl font-headline font-bold text-on-surface mb-2">What pages do you need?</h1>
               <p class="text-on-surface-variant mb-10 text-lg">We'll build the navigation based on this.</p>

               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button *ngFor="let page of pageOptions" (click)="togglePage(page.id, page.required)"
                         class="flex items-center gap-4 p-5 rounded-2xl transition-all border text-left"
                         [ngClass]="hasPage(page.id) ? 'border-secondary bg-secondary-fixed/50' : 'border-outline-variant/15 bg-surface-container-lowest hover:border-outline'">
                    <div class="w-6 h-6 rounded border-2 flex items-center justify-center"
                         [ngClass]="hasPage(page.id) ? 'border-secondary bg-secondary' : 'border-outline-variant/30'">
                      <span *ngIf="hasPage(page.id)" class="material-symbols-outlined text-white text-sm font-bold">check</span>
                    </div>
                    <div class="flex-1">
                      <div class="font-semibold" [ngClass]="hasPage(page.id) ? 'text-on-surface' : 'text-on-surface-variant'">{{ page.label }}</div>
                      <div *ngIf="page.required" class="text-xs text-secondary mt-0.5 font-bold uppercase">Required</div>
                    </div>
                 </button>
               </div>
            </div>

            <!-- STEP 4: Features & Contact -->
            <div *ngIf="currentStep === 4" class="cinematic-reveal">
               <h1 class="text-3xl lg:text-4xl font-headline font-bold text-on-surface mb-2">Add specific features</h1>
               <p class="text-on-surface-variant mb-10 text-lg">Enhance your site with these add-ons.</p>

               <div class="space-y-3 mb-10">
                 <button *ngFor="let extra of extraOptions" (click)="toggleExtra(extra.id)"
                         class="w-full flex items-center justify-between p-5 rounded-2xl transition-all border"
                         [ngClass]="hasExtra(extra.id) ? 'border-secondary bg-secondary-fixed/50' : 'border-outline-variant/15 bg-surface-container-lowest hover:border-outline'">
                   <div class="text-left">
                     <div class="font-bold text-on-surface">{{ extra.label }}</div>
                     <div class="text-sm text-on-surface-variant mt-1">{{ extra.desc }}</div>
                   </div>
                   <!-- Switch -->
                   <div class="w-12 h-6 rounded-full transition-colors relative flex items-center"
                        [ngClass]="hasExtra(extra.id) ? 'bg-secondary' : 'bg-surface-container-high'">
                     <div class="w-4 h-4 rounded-full bg-white absolute transition-all"
                          [ngClass]="hasExtra(extra.id) ? 'left-7' : 'left-1'"></div>
                   </div>
                 </button>
               </div>

               <h2 class="text-xl font-headline font-bold text-on-surface mb-4 border-t border-outline-variant/10 pt-8">Contact Info Backup</h2>
               <div class="space-y-4">
                 <div>
                    <label class="block text-sm font-semibold text-on-surface mb-2">Email Address</label>
                    <input type="email" [(ngModel)]="data.email" class="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl">
                 </div>
               </div>
            </div>

            <!-- STEP 5: Review -->
            <div *ngIf="currentStep === 5" class="cinematic-reveal">
               <div class="text-center mb-8">
                 <div class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mx-auto mb-4">
                   <span class="material-symbols-outlined text-3xl">task_alt</span>
                 </div>
                 <h1 class="text-3xl lg:text-4xl font-headline font-bold text-on-surface mb-2">Ready to generate</h1>
                 <p class="text-on-surface-variant text-lg">Everything looks good on our end.</p>
               </div>
               
               <div class="bg-surface-container border border-outline-variant/10 rounded-3xl p-8 mb-8">
                 <div class="mb-6 flex justify-between items-center border-b border-outline-variant/10 pb-4">
                   <span class="text-on-surface-variant font-medium">Business Name</span>
                   <span class="font-bold text-on-surface">{{ data.businessName }}</span>
                 </div>
                 <div class="mb-6 flex justify-between items-center border-b border-outline-variant/10 pb-4">
                   <span class="text-on-surface-variant font-medium">Template</span>
                   <span class="font-bold text-on-surface capitalize">{{ data.templateId || 'None' }}</span>
                 </div>
                 <div class="flex justify-between items-center">
                   <span class="text-on-surface-variant font-medium">Total Pages</span>
                   <span class="font-bold text-on-surface">{{ data.pages.length }}</span>
                 </div>
               </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="mt-12 flex items-center gap-4 border-t border-outline-variant/10 pt-8">
              <button *ngIf="currentStep > 1" (click)="back()" class="px-6 py-4 rounded-full font-bold text-on-surface bg-surface-container hover:bg-surface-container-high transition-all">
                Back
              </button>
              <div class="flex-1"></div>
              <button *ngIf="currentStep < totalSteps" (click)="next()" [disabled]="!canProceed()"
                      class="px-8 py-4 bg-secondary text-white rounded-full font-bold shadow-lg shadow-secondary/20 hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                Continue <span class="material-symbols-outlined">arrow_forward</span>
              </button>
              <button *ngIf="currentStep === totalSteps" (click)="submit()"
                      class="px-8 py-4 bg-secondary text-white rounded-full font-bold shadow-lg shadow-secondary/20 hover:bg-secondary-container transition-all active:scale-95 flex items-center gap-2">
                Submit Build <span class="material-symbols-outlined">rocket_launch</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- Right side: Live Preview Mock Browser (45%) -->
      <div class="w-full lg:w-[45%] bg-surface-container border-l border-outline-variant/10 hidden lg:flex flex-col p-8 relative">
         <!-- Decor -->
         <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlN2U4ZTkiLz48L3N2Zz4=')] opacity-50"></div>
         
         <!-- Mock Browser Chrome -->
         <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 flex-1 flex flex-col relative z-10 overflow-hidden transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              [ngClass]="'translate-y-0 scale-100'">
            <!-- Browser Header -->
            <div class="h-12 bg-surface-container border-b border-outline-variant/10 flex items-center px-4 gap-4">
              <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-error/80"></div>
                <div class="w-3 h-3 rounded-full bg-secondary/80"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div class="bg-surface-container-lowest flex-1 h-7 rounded-md border border-outline-variant/20 flex items-center px-3 justify-center">
                 <span class="text-xs text-on-surface-variant font-medium">{{ data.businessName ? data.businessName.toLowerCase().replace(' ', '-') + '.ariesventures.com' : 'your-site.ariesventures.com' }}</span>
              </div>
            </div>

            <!-- Preview Body -->
            <div class="flex-1 bg-surface relative overflow-hidden flex flex-col">
               <!-- Header inside preview -->
               <div class="p-4 border-b border-outline-variant/10 flex items-center justify-between" [style.backgroundColor]="data.primaryColor + '10'">
                  <div class="font-headline font-bold" [style.color]="data.primaryColor">{{ data.businessName || 'Your Brand' }}</div>
                  <div class="flex gap-3">
                     <div *ngFor="let p of data.pages.slice(0, 3)" class="text-[10px] font-bold uppercase text-on-surface-variant">{{ getPageLabel(p) }}</div>
                  </div>
               </div>

               <!-- Here section -->
               <div class="flex-1 flex flex-col items-center justify-center p-8 text-center relative" [style.backgroundColor]="data.primaryColor + '05'">
                  <div class="w-20 h-20 rounded-2xl mb-6 shadow-xl flex items-center justify-center" [style.backgroundColor]="data.primaryColor">
                     <span class="material-symbols-outlined text-white text-3xl">{{ getIndustryIcon() }}</span>
                  </div>
                  <h2 class="text-2xl font-headline font-bold text-on-surface mb-2">{{ data.description ? 'Welcome to ' + data.businessName : 'Crafting Digital Experiences' }}</h2>
                  <p class="text-on-surface-variant text-sm max-w-[80%]">{{ data.description || 'Focus on your business while we handle the pixels.' }}</p>

                  <div class="mt-8 px-6 py-3 rounded-full text-white font-bold text-sm shadow-lg" [style.backgroundColor]="data.primaryColor">
                     Primary Action
                  </div>
               </div>
               
               <!-- Features Strip -->
               <div class="h-16 border-t border-outline-variant/10 flex items-center justify-center gap-6 px-6 bg-surface-container-lowest">
                 <div *ngFor="let extra of data.extras" class="flex items-center gap-1 text-xs font-bold text-on-surface-variant">
                   <span class="w-1.5 h-1.5 rounded-full" [style.backgroundColor]="data.primaryColor"></span>
                   {{ extra }}
                 </div>
               </div>
            </div>
         </div>

         <!-- Info panel -->
         <div class="text-center mt-6 z-10">
           <span class="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-xs font-bold text-on-surface shadow-sm">
             <span class="flex h-2 w-2 relative">
               <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
               <span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
             </span>
             Live Preview Generating
           </span>
         </div>
      </div>
    </div>
  `
})
export class GuidedOnboardingComponent implements OnInit, AfterViewInit {
  private router = inject(Router);

  currentStep = 1;
  totalSteps = 5;

  data = {
    businessName: '',
    industry: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    primaryColor: '#0058be',
    templateId: 'grooming',
    pages: [] as string[],
    extras: [] as string[]
  };

  industries = [
    'Barbershop', 'Restaurant / Café', 'Salon / Beauty',
    'Retail / Shop', 'Plumber / Electrician', 'Landscaping',
    'Cleaning Services', 'Personal Trainer', 'Other'
  ];

  templates = [
    { id: 'grooming', name: 'Aries Grooming', industry: 'Barber' },
    { id: 'restaurant', name: 'AVT Restaurant', industry: 'Food' },
    { id: 'barber2', name: 'AV Premium Barber', industry: 'Barber' },
    { id: 'saloon', name: 'AV Saloon', industry: 'Beauty' }
  ];

  pageOptions = [
    { id: 'home', label: 'Home', required: true },
    { id: 'about', label: 'About Us', required: false },
    { id: 'services', label: 'Services', required: false },
    { id: 'gallery', label: 'Gallery', required: false },
    { id: 'booking', label: 'Booking', required: false },
    { id: 'contact', label: 'Contact', required: true }
  ];

  extraOptions = [
    { id: 'seo', label: 'SEO Setup', desc: 'Rank higher on Google' },
    { id: 'analytics', label: 'Analytics', desc: 'Track your visitors' },
    { id: 'chat', label: 'Live Chat', desc: 'Chat with customers' },
    { id: 'social', label: 'Social Links', desc: 'Link your socials' }
  ];

  colors = ['#0058be', '#1a1c1e', '#16a34a', '#dc2626', '#9333ea', '#ea580c'];

  constructor() {
    this.data.pages = ['home', 'contact'];
  }

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

  togglePage(id: string, required: boolean) {
    if (required) return;
    const idx = this.data.pages.indexOf(id);
    if (idx > -1) this.data.pages.splice(idx, 1);
    else this.data.pages.push(id);
  }

  hasPage(id: string) { return this.data.pages.includes(id); }

  toggleExtra(id: string) {
    const idx = this.data.extras.indexOf(id);
    if (idx > -1) this.data.extras.splice(idx, 1);
    else this.data.extras.push(id);
  }

  hasExtra(id: string) { return this.data.extras.includes(id); }

  selectTemplate(id: string) { this.data.templateId = id; }
  selectColor(c: string) { this.data.primaryColor = c; }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1: return !!this.data.businessName && !!this.data.industry;
      case 2: return !!this.data.templateId;
      case 3: return this.data.pages.length >= 2;
      case 4: return !!this.data.email;
      default: return true;
    }
  }

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
  submit() { this.router.navigate(['/contact']); }

  get progress() { return (this.currentStep / this.totalSteps) * 100; }

  get stepLabels() { return ['Business', 'Template', 'Pages', 'Contact', 'Review']; }

  getPageLabel(id: string) { return this.pageOptions.find(p => p.id === id)?.label || id; }
  
  getIndustryIcon() {
    if (!this.data.industry) return 'storefront';
    const clean = this.data.industry.toLowerCase();
    if (clean.includes('barber') || clean.includes('salon')) return 'spa';
    if (clean.includes('food') || clean.includes('restaurant')) return 'restaurant';
    if (clean.includes('clean') || clean.includes('plumb')) return 'home_repair_service';
    return 'storefront';
  }
}
