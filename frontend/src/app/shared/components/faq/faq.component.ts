import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'pricing' | 'process' | 'technical' | 'support';
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="faq-section py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about our services.
          </p>
        </div>

        <!-- Category Filter -->
        <div class="category-filter flex flex-wrap justify-center gap-4 mb-12">
          <button *ngFor="let category of categories"
                  [class.active]="selectedCategory === category.key"
                  (click)="filterByCategory(category.key)"
                  class="category-btn px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">{{ category.icon }}</span>
            {{ category.label }}
          </button>
        </div>

        <!-- FAQ Accordion -->
        <div class="faq-accordion max-w-4xl mx-auto">
          <div *ngFor="let faq of filteredFaqs; let i = index"
               class="faq-item mb-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
               [class.active]="activeIndex === i">
            
            <button class="faq-question w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors duration-300"
                    (click)="toggle(i)">
              <span class="text-lg font-semibold text-gray-900 pr-4">
                {{ faq.question }}
              </span>
              <span class="faq-icon text-2xl text-blue-600 flex-shrink-0 transform transition-transform duration-300"
                    [class.rotate-45]="activeIndex === i">
                {{ activeIndex === i ? '−' : '+' }}
              </span>
            </button>
            
            <div class="faq-answer overflow-hidden transition-all duration-300 ease-in-out"
                 [class.expanded]="activeIndex === i"
                 [@slideDown]="activeIndex === i ? 'expanded' : 'collapsed'">
              <div class="p-6 pt-0 text-gray-700 leading-relaxed">
                <p [innerHTML]="faq.answer"></p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="faq-cta mt-16 text-center">
          <div class="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div class="mb-4">
              <span class="material-symbols-outlined text-4xl text-blue-600">help</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p class="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our friendly team is here to help.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Contact Us
              </button>
              <button class="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all duration-300">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .category-btn {
      background: white;
      color: #6B7280;
      border: 2px solid #E5E7EB;
    }

    .category-btn:hover {
      border-color: #3B82F6;
      color: #3B82F6;
      transform: translateY(-2px);
    }

    .category-btn.active {
      background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
      color: white;
      border-color: transparent;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .faq-item {
      border: 1px solid #E5E7EB;
    }

    .faq-item.active {
      border-color: #3B82F6;
      box-shadow: 0 0 0 1px #3B82F6;
    }

    .faq-answer {
      max-height: 0;
    }

    .faq-answer.expanded {
      max-height: 500px;
    }

    .faq-icon.rotate-45 {
      transform: rotate(45deg);
    }

    .faq-question:hover .faq-icon {
      transform: scale(1.1);
    }

    .faq-item:hover {
      transform: translateY(-2px);
    }

    /* Animation for smooth expand/collapse */
    .faq-answer {
      transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
    }
  `],
  animations: [
    trigger('slideDown', [
      state('collapsed', style({
        height: '0px',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        overflow: 'visible'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class FaqComponent {
  activeIndex: number | null = null;
  selectedCategory: string = 'all';

  categories = [
    { key: 'all', label: 'All Questions', icon: 'list_alt' },
    { key: 'pricing', label: 'Pricing & Billing', icon: 'payments' },
    { key: 'process', label: 'Process & Timeline', icon: 'schedule' },
    { key: 'technical', label: 'Technical', icon: 'settings' },
    { key: 'support', label: 'Support', icon: 'headset_mic' }
  ];

  faqs: FAQ[] = [
    {
      id: '1',
      question: 'How much does a website cost?',
      answer: 'Our website packages start from £59/month for a basic business website. The final cost depends on your specific requirements, features needed, and complexity. We offer three main packages: <strong>Starter (£59/month)</strong>, <strong>Professional (£99/month)</strong>, and <strong>Enterprise (£199/month)</strong>. All packages include hosting, maintenance, and support.',
      category: 'pricing'
    },
    {
      id: '2',
      question: 'How long does it take to build a website?',
      answer: 'We pride ourselves on fast delivery! Most websites are completed within <strong>14 days</strong> from the start of the project. This includes design, development, content integration, and testing. Complex e-commerce sites or custom applications may take 3-4 weeks. We\'ll give you an exact timeline during your consultation.',
      category: 'process'
    },
    {
      id: '3',
      question: 'Do you provide ongoing support and maintenance?',
      answer: 'Absolutely! All our packages include ongoing support and maintenance. This covers security updates, backups, performance monitoring, content updates, and technical support. You\'ll have direct access to our support team via email, phone, or live chat.',
      category: 'support'
    },
    {
      id: '4',
      question: 'Will my website be mobile-friendly?',
      answer: 'Yes, every website we create is fully responsive and mobile-optimized. With over 60% of web traffic coming from mobile devices, we ensure your site looks and works perfectly on all screen sizes - from smartphones to tablets to desktop computers.',
      category: 'technical'
    },
    {
      id: '5',
      question: 'Can I update the website content myself?',
      answer: 'Yes! We build all websites with user-friendly content management systems. You\'ll receive training on how to update text, images, and basic content. For more complex changes, our support team is always available to help.',
      category: 'technical'
    },
    {
      id: '6',
      question: 'What if I\'m not happy with the website?',
      answer: 'We offer a <strong>100% satisfaction guarantee</strong>. If you\'re not completely happy with your website, we\'ll work with you to make it right. If we still can\'t meet your expectations, we\'ll provide a full refund within the first 30 days.',
      category: 'support'
    },
    {
      id: '7',
      question: 'Do you help with SEO and Google rankings?',
      answer: 'Yes! All our websites are built with SEO best practices from the ground up. This includes optimized page structure, fast loading speeds, mobile optimization, and basic on-page SEO. We also offer advanced SEO services to help improve your Google rankings.',
      category: 'technical'
    },
    {
      id: '8',
      question: 'What\'s included in the monthly fee?',
      answer: 'Your monthly fee includes: web hosting, SSL certificate, regular backups, security monitoring, software updates, basic content updates, technical support, and performance optimization. Essentially, everything you need to keep your website running smoothly.',
      category: 'pricing'
    },
    {
      id: '9',
      question: 'Can you help migrate my existing website?',
      answer: 'Absolutely! We can migrate your existing website content, including text, images, and basic functionality. We\'ll ensure no content is lost and that your SEO rankings are preserved during the migration process.',
      category: 'process'
    },
    {
      id: '10',
      question: 'Do you work with businesses outside the UK?',
      answer: 'While we\'re based in the UK, we work with businesses worldwide. We\'ve successfully delivered projects for clients in Europe, North America, and Australia. All communication is handled in English, and we accommodate different time zones.',
      category: 'support'
    }
  ];

  get filteredFaqs(): FAQ[] {
    if (this.selectedCategory === 'all') {
      return this.faqs;
    }
    return this.faqs.filter(faq => faq.category === this.selectedCategory);
  }

  toggle(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.activeIndex = null; // Close any open FAQ when switching categories
  }
}