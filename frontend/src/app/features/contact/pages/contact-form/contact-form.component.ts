import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormStateService } from '../../../../core/services/form-state.service';
import { ContextService } from '../../../../core/services/context.service';
import { ProgressBarComponent } from '../../../../shared/components/progress-bar/progress-bar.component';
import { StepOneComponent } from '../../components/step-one/step-one.component';
import { StepTwoComponent } from '../../components/step-two/step-two.component';
import { StepThreeComponent } from '../../components/step-three/step-three.component';
import { StepFourComponent } from '../../components/step-four/step-four.component';
import { ContactFormData } from '../../../../core/models/contact-form.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ProgressBarComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  currentStep = this.formStateService.currentStep$;
  contextBanner = signal<string | null>(null);
  showContextBanner = signal(false);

  readonly steps = [
    { number: 1, name: 'Context & Intent', icon: 'target' },
    { number: 2, name: 'Business Info', icon: 'building' },
    { number: 3, name: 'Requirements', icon: 'clipboard-list' },
    { number: 4, name: 'Contact Details', icon: 'user' }
  ];

  canGoBack = computed(() => this.currentStep() > 1);
  canGoForward = computed(() => this.currentStep() < 4);

  constructor(
    private formStateService: FormStateService,
    private contextService: ContextService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContext();
    this.checkForSavedProgress();
  }

  private loadContext(): void {
    const context = this.contextService.getContext();
    
    if (context) {
      switch (context.source) {
        case 'template':
          this.contextBanner.set(
            `✓ We've saved your template selection: ${context.data['templateName']}`
          );
          break;
        case 'service':
          this.contextBanner.set(
            `✓ You're interested in: ${context.data['serviceName']}`
          );
          break;
        case 'pricing':
          this.contextBanner.set(
            `✓ You've selected the ${context.data['tier'].toUpperCase()} plan`
          );
          break;
      }
      
      if (this.contextBanner()) {
        this.showContextBanner.set(true);
      }
    }
  }

  private checkForSavedProgress(): void {
    const saved = this.formStateService.getFormData();
    if (saved && saved.metadata?.lastSavedAt) {
      console.log('Found saved progress from', saved.metadata.lastSavedAt);
    }
  }

  dismissContextBanner(): void {
    this.showContextBanner.set(false);
  }

  goToStep(step: number): void {
    this.formStateService.goToStep(step);
  }

  nextStep(): void {
    this.formStateService.nextStep();
  }

  previousStep(): void {
    this.formStateService.previousStep();
  }

  onStepComplete(stepData: any): void {
    const stepKey = this.getStepKey(this.currentStep());
    this.formStateService.updateFormData(stepKey, stepData);
    
    if (this.currentStep() < 4) {
      this.nextStep();
    } else {
      // Form complete - navigate to thank you page
      this.router.navigate(['/contact/thank-you']);
    }
  }

  private getStepKey(step: number): keyof ContactFormData {
    const keys: Record<number, keyof ContactFormData> = {
      1: 'context',
      2: 'businessInfo',
      3: 'projectRequirements',
      4: 'contactInfo'
    };
    return keys[step];
  }
}
