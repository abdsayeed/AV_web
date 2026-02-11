import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetTier } from '../../../core/models/contact-form.model';

@Component({
  selector: 'app-budget-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      @for (tier of tiers; track tier.id) {
        <button
          type="button"
          (click)="tierSelected.emit(tier.id)"
          class="relative p-6 border-2 rounded-lg transition-all duration-200 text-left"
          [class.border-blue-600]="selected === tier.id"
          [class.bg-blue-50]="selected === tier.id"
          [class.border-gray-300]="selected !== tier.id"
          [class.bg-white]="selected !== tier.id"
          [class.hover:border-blue-400]="selected !== tier.id">
          
          @if (tier.badge) {
            <span class="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {{ tier.badge }}
            </span>
          }

          <div class="text-center mb-4">
            <h3 class="text-lg font-bold mb-2"
                [class.text-blue-900]="selected === tier.id"
                [class.text-gray-900]="selected !== tier.id">
              {{ tier.name }}
            </h3>
            <div class="text-3xl font-bold"
                 [class.text-blue-600]="selected === tier.id"
                 [class.text-gray-900]="selected !== tier.id">
              {{ tier.price }}
            </div>
            <div class="text-sm text-gray-500 mt-1">per month</div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="text-xs font-semibold text-gray-700 mb-2">Features:</div>
            @for (feature of tier.features; track feature) {
              <div class="flex items-start gap-2 text-xs text-gray-600">
                <span class="text-green-500 mt-0.5">✓</span>
                <span>{{ feature }}</span>
              </div>
            }
          </div>

          <div class="border-t pt-3">
            <div class="text-xs font-semibold text-gray-700 mb-2">Perfect for:</div>
            @for (item of tier.perfectFor; track item) {
              <div class="text-xs text-gray-600 mb-1">• {{ item }}</div>
            }
          </div>

          @if (selected === tier.id) {
            <div class="absolute top-4 right-4">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
          }
        </button>
      }
    </div>
  `
})
export class BudgetSelectorComponent {
  @Input() tiers: BudgetTier[] = [];
  @Input() selected: string = '';
  @Output() tierSelected = new EventEmitter<string>();
}
