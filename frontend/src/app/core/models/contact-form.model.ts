export interface ContactFormData {
  // Step 1: Context & Intent
  context: {
    source: 'direct' | 'template' | 'service' | 'pricing' | 'other';
    referrer?: string;
    templateId?: string;
    serviceId?: string;
    primaryGoal: 'new_website' | 'redesign' | 'add_features' | 'consultation' | 'other';
  };

  // Step 2: Business Information
  businessInfo: {
    name: string;
    industry: string;
    currentWebsite?: string;
    websiteType: WebsiteType;
  };

  // Step 3: Project Requirements
  projectRequirements: {
    servicesNeeded: string[];
    budgetRange: 'basic' | 'pro' | 'custom';
    timeline: 'urgent' | 'flexible' | 'specific';
    targetDate?: Date;
    additionalRequirements?: string;
  };

  // Step 4: Contact Details
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    preferredContact: 'email' | 'phone' | 'either';
    bestTimeToReach: 'morning' | 'afternoon' | 'evening' | 'anytime';
  };

  // Metadata
  metadata: {
    submissionId?: string;
    startedAt: Date;
    lastSavedAt?: Date;
    completedAt?: Date;
    currentStep: number;
  };
}

export type WebsiteType = 
  | 'ecommerce'
  | 'portfolio'
  | 'blog'
  | 'corporate'
  | 'landing'
  | 'custom';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  timeline: string;
  popular?: boolean;
}

export interface BudgetTier {
  id: 'basic' | 'pro' | 'custom';
  name: string;
  price: string;
  badge?: string;
  features: string[];
  perfectFor: string[];
  popular?: boolean;
}

export interface IndustryOption {
  value: string;
  label: string;
  popular?: boolean;
}
