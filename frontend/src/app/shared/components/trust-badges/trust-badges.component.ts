import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrustBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'security' | 'payment' | 'business' | 'guarantee';
}

@Component({
  selector: 'app-trust-badges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-surface-container-lowest">
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center mb-12">
          <div *ngFor="let badge of trustBadges"
               class="flex flex-col items-center gap-2 p-4 rounded-3xl bg-surface-container hover:bg-surface-container-high transition-all duration-300 group cursor-default"
               [title]="badge.description">
            <span class="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-secondary transition-colors">{{ badge.icon }}</span>
            <span class="text-xs font-semibold text-on-surface-variant text-center font-label">{{ badge.name }}</span>
          </div>
        </div>

        <!-- Guarantee bar -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-container rounded-3xl px-10 py-8">
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-3xl text-secondary">verified</span>
            <div>
              <div class="font-headline font-bold text-on-surface text-lg">100% Satisfaction Guarantee</div>
              <div class="text-on-surface-variant text-sm">Not happy? We'll work until you love it, or your money back.</div>
            </div>
          </div>
          <div class="flex items-center gap-6 text-sm text-on-surface-variant">
            <div class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-secondary">lock</span> SSL Encrypted</div>
            <div class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-secondary">shield</span> GDPR Compliant</div>
            <div class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-secondary">speed</span> 99.9% Uptime</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`:host { display: block; }`]
})
export class TrustBadgesComponent {
  trustBadges: TrustBadge[] = [
    {
      id: 'ssl',
      name: 'SSL Secure',
      icon: 'lock',
      description: 'All data is encrypted with 256-bit SSL security',
      type: 'security'
    },
    {
      id: 'gdpr',
      name: 'GDPR Compliant',
      icon: 'shield',
      description: 'Fully compliant with data protection regulations',
      type: 'security'
    },
    {
      id: 'stripe',
      name: 'Stripe Verified',
      icon: 'credit_card',
      description: 'Secure payments processed by Stripe',
      type: 'payment'
    },
    {
      id: 'business',
      name: 'Registered Business',
      icon: 'business',
      description: 'Officially registered and licensed business',
      type: 'business'
    },
    {
      id: 'support',
      name: '24/7 Support',
      icon: 'headset_mic',
      description: 'Round-the-clock customer support available',
      type: 'business'
    },
    {
      id: 'guarantee',
      name: 'Money Back',
      icon: 'check_circle',
      description: '100% satisfaction or money back guarantee',
      type: 'guarantee'
    }
  ];
}