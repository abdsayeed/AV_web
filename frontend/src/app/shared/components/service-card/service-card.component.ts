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
      [class.border-gray-300]="!selected"
      [class.bg-white]="!selected"
      [class.hover:border-blue-400]="!selected">
      
      @if (service.popular) {
        <span class="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
          POPULAR
        </span>
      }

      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 text-2xl">
          {{ service.icon }}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h4 class="font-medium text-sm"
                [class.text-blue-900]="selected"
                [class.text-gray-900]="!selected">
              {{ service.name }}
            </h4>
            
            @if (selected) {
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            }
          </div>
          
          <p class="text-xs text-gray-600 mb-2">{{ service.description }}</p>
          
          <div class="flex items-center gap-1 text-xs"
               [class.text-blue-700]="selected"
               [class.text-gray-500]="!selected">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
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
  @Output() toggle = new EventEmitter<void>();
}
