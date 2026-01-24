import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  number: number;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-bar">
      <div class="flex items-center justify-between">
        @for (step of steps; track step.number; let i = $index) {
          <div class="flex items-center" [class.flex-1]="i < steps.length - 1">
            <!-- Step Circle -->
            <button
              (click)="onStepClick(step.number)"
              [disabled]="step.number > currentStep"
              class="flex flex-col items-center group"
              [class.cursor-pointer]="step.number <= currentStep"
              [class.cursor-not-allowed]="step.number > currentStep">
              
              <div class="relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all"
                   [class.border-blue-600]="step.number <= currentStep"
                   [class.bg-blue-600]="step.number === currentStep"
                   [class.bg-white]="step.number < currentStep"
                   [class.border-gray-300]="step.number > currentStep"
                   [class.bg-gray-50]="step.number > currentStep">
                
                @if (step.number < currentStep) {
                  <!-- Completed -->
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                } @else {
                  <!-- Step Number -->
                  <span class="text-sm font-semibold"
                        [class.text-white]="step.number === currentStep"
                        [class.text-blue-600]="step.number !== currentStep && step.number <= currentStep"
                        [class.text-gray-400]="step.number > currentStep">
                    {{ step.number }}
                  </span>
                }
              </div>

              <span class="mt-2 text-xs font-medium hidden sm:block"
                    [class.text-blue-600]="step.number <= currentStep"
                    [class.text-gray-400]="step.number > currentStep">
                {{ step.name }}
              </span>
            </button>

            <!-- Connector Line -->
            @if (i < steps.length - 1) {
              <div class="flex-1 h-0.5 mx-2"
                   [class.bg-blue-600]="step.number < currentStep"
                   [class.bg-gray-300]="step.number >= currentStep">
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .progress-bar {
      @apply w-full;
    }
  `]
})
export class ProgressBarComponent {
  @Input() steps: Step[] = [];
  @Input() currentStep: number = 1;
  @Output() stepClicked = new EventEmitter<number>();

  onStepClick(step: number): void {
    if (step <= this.currentStep) {
      this.stepClicked.emit(step);
    }
  }
}
