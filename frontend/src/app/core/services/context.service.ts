import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormContext } from '../models/form-context.model';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private readonly CONTEXT_KEY = 'form_context';

  constructor(private router: Router) {}

  // Save context when navigating to contact form
  setContext(context: FormContext): void {
    sessionStorage.setItem(this.CONTEXT_KEY, JSON.stringify(context));
  }

  // Get context when loading contact form
  getContext(): FormContext | null {
    const stored = sessionStorage.getItem(this.CONTEXT_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  clearContext(): void {
    sessionStorage.removeItem(this.CONTEXT_KEY);
  }

  // Navigate to contact form with context
  navigateToContactWithTemplate(templateId: string, templateName: string, websiteType: string): void {
    const context: FormContext = {
      source: 'template',
      data: {
        templateId,
        templateName,
        websiteType
      },
      timestamp: new Date()
    };
    this.setContext(context);
    this.router.navigate(['/contact'], {
      queryParams: {
        source: 'template',
        template_id: templateId
      }
    });
  }

  navigateToContactWithService(serviceId: string, serviceName: string): void {
    const context: FormContext = {
      source: 'service',
      data: {
        serviceId,
        serviceName
      },
      timestamp: new Date()
    };
    this.setContext(context);
    this.router.navigate(['/contact'], {
      queryParams: {
        source: 'service',
        service: serviceId
      }
    });
  }

  navigateToContactWithPricing(tier: string, price: string): void {
    const context: FormContext = {
      source: 'pricing',
      data: {
        tier,
        price
      },
      timestamp: new Date()
    };
    this.setContext(context);
    this.router.navigate(['/contact'], {
      queryParams: {
        source: 'pricing',
        tier
      }
    });
  }
}
