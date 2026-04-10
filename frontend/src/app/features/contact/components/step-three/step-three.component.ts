import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormStateService } from '../../../../core/services/form-state.service';
import { ContextService } from '../../../../core/services/context.service';

@Component({
  selector: 'app-step-three',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cinematic-reveal">
      <h2 class="text-3xl font-headline font-bold text-on-surface mb-2">What services do you need?</h2>
      <p class="text-on-surface-variant mb-10">Select all that apply. Don't worry if you're not sure, we can discuss it later.</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
        
        <div>
          <div class="flex flex-wrap gap-4">
            @for (service of availableServices; track service) {
              <button type="button" 
                      (click)="toggleService(service)"
                      class="px-6 py-4 rounded-3xl font-semibold transition-all border shadow-sm"
                      [ngClass]="isSelected(service) 
                        ? 'bg-secondary text-on-primary border-secondary shadow-md shadow-secondary/20 scale-[1.02]' 
                        : 'bg-surface-container border-outline-variant/15 text-on-surface hover:bg-surface-container-high'">
                {{ service }}
              </button>
            }
          </div>
          @if (form.controls['services'].invalid && form.controls['services'].touched) {
            <p class="text-sm text-error font-medium mt-4">Please select at least one service</p>
          }
        </div>

        <button type="submit" 
                class="w-full py-4 mt-8 bg-secondary text-on-primary font-bold text-lg rounded-full hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50">
          Continue &rarr;
        </button>
      </form>
    </div>
  `
})
export class StepThreeComponent implements OnInit {
  @Output() completed = new EventEmitter<any>();

  form: FormGroup;
  availableServices = [
    'Brand Design',
    'Copywriting',
    'SEO',
    'Analytics Setting',
    'E-Commerce Setup',
    'Blog Integration',
    'Custom Integrations',
    'Ongoing Maintenance'
  ];

  constructor(
    private fb: FormBuilder,
    private formStateService: FormStateService,
    private contextService: ContextService
  ) {
    this.form = this.fb.group({
      services: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    const saved = this.formStateService.getFormData();
    if (saved.servicesInfo) {
      this.form.patchValue(saved.servicesInfo);
    }
  }

  toggleService(service: string): void {
    const currentList: string[] = [...(this.form.value.services || [])];
    const index = currentList.indexOf(service);
    
    if (index > -1) {
      currentList.splice(index, 1);
    } else {
      currentList.push(service);
    }
    
    this.form.patchValue({ services: currentList });
    this.form.controls['services'].markAsTouched();
  }

  isSelected(service: string): boolean {
    const currentList = this.form.value.services || [];
    return currentList.includes(service);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.completed.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
