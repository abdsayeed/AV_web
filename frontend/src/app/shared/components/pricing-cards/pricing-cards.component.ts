import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [id]="sectionId" class="py-32 bg-surface">
      <div class="max-w-7xl mx-auto px-8">
        <div class="text-center mb-16">
          <span class="text-secondary font-bold font-label tracking-widest text-sm uppercase">Flexibility</span>
          <h2 class="text-5xl font-headline font-bold mt-4 text-on-surface">Pricing Built For Scale</h2>
          <p class="text-on-surface-variant text-lg mt-6 max-w-2xl mx-auto">Simple pricing tiers to suit your current stage. No hidden fees, no surprises.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <div *ngFor="let plan of pricingPlans"
               class="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-lg border border-outline-variant/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">

            <!-- Image header -->
            <div class="h-44 bg-cover bg-center relative" [style.background-image]="'url(' + plan.image + ')'">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-lg"
                    [ngClass]="{
                      'bg-error':      plan.color === 'primary',
                      'bg-secondary':  plan.color === 'blue',
                      'bg-[#068f5c]':  plan.color === 'green'
                    }">{{ plan.badge }}</span>
              <div class="absolute bottom-4 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
                <h3 class="text-xl font-headline font-bold text-white">{{ plan.name }}</h3>
              </div>
            </div>

            <div class="p-8 flex flex-col flex-1">
              <!-- Price -->
              <p class="text-4xl font-headline font-black mb-1"
                 [ngClass]="{
                   'text-error':     plan.color === 'primary',
                   'text-secondary': plan.color === 'blue',
                   'text-[#068f5c]': plan.color === 'green'
                 }">
                {{ plan.price }}<span class="text-sm font-body font-normal text-on-surface-variant">{{ plan.priceLabel }}</span>
              </p>
              <p class="text-on-surface-variant text-sm leading-relaxed mb-6">{{ plan.description }}</p>

              <!-- Features -->
              <ul class="space-y-2.5 mb-6 flex-1">
                <li *ngFor="let feature of plan.features" class="flex items-start gap-3 text-sm text-on-surface">
                  <span class="material-symbols-outlined text-[#068f5c] text-[18px] mt-0.5 flex-shrink-0">check_circle</span>
                  <span class="leading-snug">{{ feature }}</span>
                </li>
              </ul>

              <!-- Contract info -->
              <div class="mb-6 p-4 bg-surface-container rounded-2xl">
                <p class="text-xs text-on-surface-variant leading-relaxed">{{ plan.contractInfo }}</p>
              </div>

              <button (click)="onPlanSelect(plan)"
                      class="w-full py-4 rounded-full font-bold transition-all hover:scale-[1.02] active:scale-95 text-white mt-auto"
                      [ngClass]="{
                        'bg-error hover:bg-error/90':       plan.color === 'primary',
                        'bg-secondary hover:bg-secondary/90': plan.color === 'blue',
                        'bg-[#068f5c] hover:bg-[#068f5c]/90': plan.color === 'green'
                      }">
                Select Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class PricingCardsComponent {
  @Input() pricingPlans: any[] = [];
  @Input() sectionId: string = 'services';
  @Output() planSelect = new EventEmitter<any>();

  onPlanSelect(plan: any) {
    this.planSelect.emit(plan);
  }
}
