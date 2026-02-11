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
    <section class="trust-badges-section py-12 bg-white border-t border-gray-100">
      <div class="container mx-auto px-6">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            Your Security & Satisfaction is Our Priority
          </h3>
          <p class="text-gray-600">
            We're committed to providing secure, reliable, and professional services
          </p>
        </div>

        <div class="trust-badges-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center">
          <div *ngFor="let badge of trustBadges" 
               class="trust-badge group cursor-pointer"
               [title]="badge.description">
            
            <div class="badge-container bg-gray-50 hover:bg-blue-50 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-200 hover:border-blue-200">
              <div class="badge-icon mb-2 text-center group-hover:scale-110 transition-transform duration-300">
                <span class="material-symbols-outlined text-3xl text-gray-600 group-hover:text-blue-600">{{ badge.icon }}</span>
              </div>
              <div class="badge-name text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors duration-300">
                {{ badge.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Guarantee Section -->
        <div class="guarantee-section mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <div class="flex flex-col md:flex-row items-center justify-center gap-6">
            <div class="guarantee-icon">
              <span class="material-symbols-outlined text-6xl text-green-600">verified</span>
            </div>
            <div class="text-center md:text-left">
              <h4 class="text-2xl font-bold text-gray-900 mb-2">
                100% Satisfaction Guarantee
              </h4>
              <p class="text-gray-600 text-lg">
                Not happy with your website? We'll work until you love it, or your money back.
              </p>
            </div>
            <div class="guarantee-badge bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-lg whitespace-nowrap flex items-center gap-2">
              <span class="material-symbols-outlined">check_circle</span>
              <span>Money Back Guarantee</span>
            </div>
          </div>
        </div>

        <!-- Security Features -->
        <div class="security-features mt-8 grid md:grid-cols-3 gap-6">
          <div class="feature-item text-center p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300">
            <div class="feature-icon mb-3">
              <span class="material-symbols-outlined text-4xl text-blue-600">lock</span>
            </div>
            <h5 class="font-bold text-gray-900 mb-2">SSL Encrypted</h5>
            <p class="text-gray-600 text-sm">All data transmission is secured with 256-bit SSL encryption</p>
          </div>
          
          <div class="feature-item text-center p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300">
            <div class="feature-icon mb-3">
              <span class="material-symbols-outlined text-4xl text-blue-600">account_balance</span>
            </div>
            <h5 class="font-bold text-gray-900 mb-2">GDPR Compliant</h5>
            <p class="text-gray-600 text-sm">Full compliance with data protection regulations</p>
          </div>
          
          <div class="feature-item text-center p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300">
            <div class="feature-icon mb-3">
              <span class="material-symbols-outlined text-4xl text-blue-600">speed</span>
            </div>
            <h5 class="font-bold text-gray-900 mb-2">99.9% Uptime</h5>
            <p class="text-gray-600 text-sm">Reliable hosting with guaranteed uptime performance</p>
          </div>
        </div>

        <!-- Payment Security -->
        <div class="payment-security mt-8 text-center">
          <p class="text-gray-600 mb-4">Secure payments powered by</p>
          <div class="payment-logos flex justify-center items-center gap-8 flex-wrap">
            <div class="payment-logo bg-white rounded-lg p-3 shadow-sm border">
              <span class="material-symbols-outlined text-2xl text-blue-600">credit_card</span>
              <span class="ml-2 font-medium text-gray-700">Stripe</span>
            </div>
            <div class="payment-logo bg-white rounded-lg p-3 shadow-sm border">
              <span class="material-symbols-outlined text-2xl text-gray-600">account_balance</span>
              <span class="ml-2 font-medium text-gray-700">Bank Transfer</span>
            </div>
            <div class="payment-logo bg-white rounded-lg p-3 shadow-sm border">
              <span class="material-symbols-outlined text-2xl text-blue-500">payments</span>
              <span class="ml-2 font-medium text-gray-700">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .trust-badge {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .trust-badge:hover {
      transform: translateY(-2px);
    }

    .badge-container {
      min-height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 140px;
    }

    .guarantee-section {
      background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%);
      border: 1px solid #e5e7eb;
    }

    .feature-item {
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .payment-logo {
      transition: all 0.3s ease;
    }

    .payment-logo:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }

    .guarantee-badge {
      animation: pulse 2s infinite;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .trust-badges-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      
      .badge-container {
        max-width: none;
        padding: 1rem;
      }
      
      .guarantee-section {
        padding: 1.5rem;
      }
      
      .guarantee-section .flex {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
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