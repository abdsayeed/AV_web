import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    <section class="py-32 bg-surface">
      <div class="max-w-4xl mx-auto px-8">
        <div class="text-center mb-20">
          <span class="text-secondary font-bold font-label tracking-widest text-sm uppercase">Got Questions?</span>
          <h2 class="text-5xl font-headline font-bold mt-4 text-on-surface">Frequently Asked</h2>
          <p class="text-on-surface-variant text-lg mt-6 max-w-2xl mx-auto">Everything you need to know about working with us.</p>
        </div>

        <!-- Category Filter -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button *ngFor="let category of categories"
                  (click)="filterByCategory(category.key)"
                  class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
                  [class]="selectedCategory === category.key
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'">
            {{ category.label }}
          </button>
        </div>

        <!-- FAQ Accordion -->
        <div class="space-y-3">
          <div *ngFor="let faq of filteredFaqs; let i = index"
               class="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/10 transition-all duration-300"
               [class.shadow-lg]="activeIndex === i">

            <button class="w-full text-left px-8 py-6 flex items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
                    (click)="toggle(i)">
              <span class="text-base font-semibold text-on-surface font-headline">{{ faq.question }}</span>
              <span class="material-symbols-outlined text-on-surface-variant flex-shrink-0 transition-transform duration-300"
                    [class.rotate-45]="activeIndex === i">add</span>
            </button>

            <div class="overflow-hidden transition-all duration-300 ease-in-out"
                 [style.max-height]="activeIndex === i ? '400px' : '0px'">
              <div class="px-8 pb-6 text-on-surface-variant leading-relaxed" [innerHTML]="faq.answer"></div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-16 text-center bg-surface-container-lowest rounded-3xl p-12 border border-outline-variant/10">
          <h3 class="text-2xl font-headline font-bold text-on-surface mb-3">Still have questions?</h3>
          <p class="text-on-surface-variant mb-8">Our team is happy to help. Reach out anytime.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" class="bg-primary-container text-on-primary px-8 py-4 rounded-full font-bold hover:bg-primary transition-all">
              Contact Us
            </a>
            <a href="/contact" class="border-2 border-outline-variant/30 text-on-surface px-8 py-4 rounded-full font-bold hover:border-secondary transition-all">
              Schedule a Call
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .rotate-45 { transform: rotate(45deg); }
  `],
  animations: []
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
      answer: 'We have three plans. <strong>Pay-As-You-Go at £59/month</strong> — a template-based site with hosting, SSL, and support included, on a 6 or 12-month minimum. <strong>Fully Managed Professional at £249/month</strong> — a fully custom design with unlimited content updates and priority support. <strong>Full Professional Website</strong> — a one-time custom build where you own everything outright, priced based on scope. We\'ll give you an exact quote after a free consultation.',
      category: 'pricing'
    },
    {
      id: '2',
      question: 'How long does it take to build my website?',
      answer: 'Most websites are live within <strong>3–5 working days</strong> from the point we have your content and sign-off. More complex builds with custom integrations (booking systems, e-commerce, etc.) typically take 7–10 days. We\'ll give you a firm timeline before we start.',
      category: 'process'
    },
    {
      id: '3',
      question: 'Do I own my website?',
      answer: 'It depends on the plan. With the <strong>Pay-As-You-Go</strong> and <strong>Fully Managed</strong> plans, we own and host the site on your behalf — you have a buyout option at any time if you want to take full ownership. With the <strong>Full Professional Website</strong> (one-time build), you own everything outright from day one including the source code.',
      category: 'pricing'
    },
    {
      id: '4',
      question: 'What\'s included in the monthly fee?',
      answer: 'Your monthly fee covers: web hosting, SSL certificate, daily backups, security monitoring, software updates, and our support team. The Fully Managed plan also includes unlimited content updates and monthly performance reports. There are no hidden fees.',
      category: 'pricing'
    },
    {
      id: '5',
      question: 'Will my website work on mobile?',
      answer: 'Yes — every site we build is mobile-first. We test across iOS and Android on multiple screen sizes before handover. Given that most local business traffic comes from phones, this is non-negotiable for us.',
      category: 'technical'
    },
    {
      id: '6',
      question: 'Can I make changes to the website myself?',
      answer: 'On the Pay-As-You-Go and Fully Managed plans, you send us change requests and we handle them — no technical knowledge needed. On the one-time build, we can set up a CMS (like WordPress or a headless option) so you can manage content yourself, or you can use our optional maintenance plan.',
      category: 'technical'
    },
    {
      id: '7',
      question: 'Do you handle SEO?',
      answer: 'Every site we build includes foundational SEO: clean URL structure, meta tags, fast load times, mobile optimisation, and Google Search Console setup. We don\'t promise specific rankings — anyone who does is misleading you — but we make sure your site is technically sound and ready to rank.',
      category: 'technical'
    },
    {
      id: '8',
      question: 'What happens if I\'m not happy with the result?',
      answer: 'We do unlimited revisions during the build phase until you\'re satisfied before we go live. If after launch something isn\'t right, we fix it. We\'ve never had a client leave unhappy — but if for any reason we genuinely can\'t deliver what was agreed, we\'ll refund you.',
      category: 'support'
    },
    {
      id: '9',
      question: 'How do I get started?',
      answer: 'Fill in our <a href="/contact" class="text-secondary font-semibold hover:underline">project inquiry form</a> — it takes about 3 minutes. We\'ll review your details and get back to you within 24 hours with a plan recommendation and next steps. No sales pressure, no obligation.',
      category: 'process'
    },
    {
      id: '10',
      question: 'Do you work with businesses outside the UK?',
      answer: 'Our pricing is in GBP and we\'re UK-based, but we work with clients internationally. We\'ve delivered projects for businesses in Europe and the Middle East. All communication is in English and we work across time zones.',
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