import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../core/models/contact-form.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="toggle.emit()"
      class="relative w-full text-left p-4 border-2 rounded-lg transition-all duration-200"
      [class.border-blue-600]="selected"
      [class.bg-blue-50]="selected"
      [class.border-gray-300]="!selected && !recommended"
      [class.border-blue-300]="!selected && recommended"
      [class.bg-white]="!selected && !recommended"
      [class.bg-blue-25]="!selected && recommended"
      [class.hover:border-blue-400]="!selected"
      [class.ring-2]="recommended"
      [class.ring-blue-200]="recommended">
      
      @if (service.popular) {
        <span class="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
          POPULAR
        </span>
      }

      @if (recommended && !selected) {
        <span class="absolute -top-2 -left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">recommend</span>
          SUGGESTED
        </span>
      }

      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <span class="material-symbols-outlined text-2xl"
                [class.text-blue-600]="selected"
                [class.text-green-600]="!selected && recommended"
                [class.text-gray-600]="!selected && !recommended">
            {{ service.icon }}
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h4 class="font-medium text-sm"
                [class.text-blue-900]="selected"
                [class.text-green-800]="!selected && recommended"
                [class.text-gray-900]="!selected && !recommended">
              {{ service.name }}
              @if (recommended && !selected) {
                <span class="material-symbols-outlined text-green-600 text-sm ml-1">recommend</span>
              }
            </h4>
            
            @if (selected) {
              <span class="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
            }
          </div>
          
          <p class="text-xs text-gray-600 mb-2">{{ service.description }}</p>
          
          <div class="flex items-center gap-1 text-xs"
               [class.text-blue-700]="selected"
               [class.text-green-700]="!selected && recommended"
               [class.text-gray-500]="!selected && !recommended">
            <span class="material-symbols-outlined text-sm">schedule</span>
            <span>{{ service.timeline }}</span>
          </div>
        </div>
      </div>
    </button>
  `
})
export class ServiceCardComponent {
  @Input() service!: Service;
  @Input() selected = false;
  @Input() recommended = false;
  @Output() toggle = new EventEmitter<void>();
}
