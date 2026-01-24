import { WebsiteType } from './contact-form.model';

export interface FormContext {
  source: string;
  data: Record<string, any>;
  timestamp: Date;
}

export interface TemplateContext {
  templateId: string;
  templateName: string;
  websiteType: WebsiteType;
}

export interface ServiceContext {
  serviceId: string;
  serviceName: string;
}

export interface PricingContext {
  tier: 'basic' | 'pro' | 'custom';
  price: string;
}
