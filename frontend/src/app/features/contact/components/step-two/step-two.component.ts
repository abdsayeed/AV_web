import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormStateService } from '../../../../core/services/form-state.service';
import { ContextService } from '../../../../core/services/context.service';

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cinematic-reveal">
      <h2 class="text-3xl font-headline font-bold text-on-surface mb-2">What is your estimated budget?</h2>
      <p class="text-on-surface-variant mb-10">This helps us recommend the right approach and tier.</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div (click)="form.patchValue({budgetTier: 'tier1'})"
               class="p-6 rounded-3xl cursor-pointer transition-all border group"
               [ngClass]="form.value.budgetTier === 'tier1' 
                 ? 'bg-secondary-fixed ring-2 ring-secondary scale-[1.02] border-secondary shadow-lg shadow-secondary/10' 
                 : 'bg-surface-container-lowest border-outline-variant/15 hover:border-secondary/50'">
            <h3 class="font-headline font-bold text-xl text-on-surface mb-1">£0 – £500</h3>
            <p class="text-sm text-on-surface-variant font-medium">Starter templates & pay-as-you-go</p>
          </div>

          <div (click)="form.patchValue({budgetTier: 'tier2'})"
               class="p-6 rounded-3xl cursor-pointer transition-all border group"
               [ngClass]="form.value.budgetTier === 'tier2' 
                 ? 'bg-secondary-fixed ring-2 ring-secondary scale-[1.02] border-secondary shadow-lg shadow-secondary/10' 
                 : 'bg-surface-container-lowest border-outline-variant/15 hover:border-secondary/50'">
            <h3 class="font-headline font-bold text-xl text-on-surface mb-1">£500 – £1,500</h3>
            <p class="text-sm text-on-surface-variant font-medium">Premium templates & core setup</p>
          </div>

          <div (click)="form.patchValue({budgetTier: 'tier3'})"
               class="p-6 rounded-3xl cursor-pointer transition-all border group"
               [ngClass]="form.value.budgetTier === 'tier3' 
                 ? 'bg-secondary-fixed ring-2 ring-secondary scale-[1.02] border-secondary shadow-lg shadow-secondary/10' 
                 : 'bg-surface-container-lowest border-outline-variant/15 hover:border-secondary/50'">
            <h3 class="font-headline font-bold text-xl text-on-surface mb-1">£1,500 – £5,000</h3>
            <p class="text-sm text-on-surface-variant font-medium">Custom design & bespoke features</p>
          </div>

          <div (click)="form.patchValue({budgetTier: 'tier4'})"
               class="p-6 rounded-3xl cursor-pointer transition-all border group"
               [ngClass]="form.value.budgetTier === 'tier4' 
                 ? 'bg-secondary-fixed ring-2 ring-secondary scale-[1.02] border-secondary shadow-lg shadow-secondary/10' 
                 : 'bg-surface-container-lowest border-outline-variant/15 hover:border-secondary/50'">
            <h3 class="font-headline font-bold text-xl text-on-surface mb-1">£5,000+</h3>
            <p class="text-sm text-on-surface-variant font-medium">Enterprise & complex web apps</p>
          </div>

        </div>

        @if (form.controls['budgetTier'].invalid && form.controls['budgetTier'].touched) {
          <p class="text-sm text-error font-medium mt-2">Please select a budget range</p>
        }

        <button type="submit" 
                class="w-full py-4 mt-8 bg-secondary text-on-primary font-bold text-lg rounded-full hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50">
          Continue &rarr;
        </button>
      </form>
    </div>
  `
})
export class StepTwoComponent implements OnInit {
  @Output() completed = new EventEmitter<any>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formStateService: FormStateService,
    private contextService: ContextService
  ) {
    this.form = this.fb.group({
      budgetTier: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const saved = this.formStateService.getFormData();
    if (saved.budgetInfo) {
      this.form.patchValue(saved.budgetInfo);
    }
    
    // Auto-select based on pricing tier plan if available
    const context = this.contextService.getContext();
    if (context && context.source === 'pricing') {
       const tier = context.data['tier'];
       if (!this.form.value.budgetTier) {
         if (tier === 'pay-as-you-go') this.form.patchValue({ budgetTier: 'tier1' });
         if (tier === 'hybrid') this.form.patchValue({ budgetTier: 'tier3' });
         if (tier === 'pro') this.form.patchValue({ budgetTier: 'tier4' });
       }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.completed.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
