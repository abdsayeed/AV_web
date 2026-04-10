import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Testimonial {
  id: string;
  customerName: string;
  businessName: string;
  industry: string;
  photo: string;
  rating: number;
  quote: string;
  results: {
    metric: string;
    value: string;
    icon: string;
  }[];
  videoUrl?: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
  date: Date;
  verified: boolean;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-32 bg-surface-container-low">
      <div class="max-w-7xl mx-auto px-8">
        <div class="text-center mb-20">
          <span class="text-secondary font-bold font-label tracking-widest text-sm uppercase">Social Proof</span>
          <h2 class="text-5xl font-headline font-bold mt-4 text-on-surface">What Our Clients Say</h2>
          <p class="text-on-surface-variant text-lg mt-6 max-w-2xl mx-auto">Real results from real businesses. See how we've helped local businesses grow online.</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let testimonial of testimonials"
               class="bg-surface-container-lowest rounded-3xl p-8 shadow-lg hover:-translate-y-2 transition-all duration-500 border border-outline-variant/10 flex flex-col">

            <!-- Stars -->
            <div class="flex gap-1 mb-6">
              <span *ngFor="let star of [1,2,3,4,5]"
                    class="material-symbols-outlined text-lg"
                    [class]="star <= testimonial.rating ? 'text-secondary' : 'text-outline-variant'">star</span>
            </div>

            <!-- Quote -->
            <blockquote class="text-on-surface-variant leading-relaxed mb-8 flex-1 text-base">
              "{{ testimonial.quote }}"
            </blockquote>

            <!-- Results -->
            <div class="grid grid-cols-3 gap-3 mb-8">
              <div *ngFor="let result of testimonial.results"
                   class="bg-secondary-fixed/40 rounded-2xl p-3 text-center">
                <div class="text-lg font-extrabold font-headline text-secondary">{{ result.value }}</div>
                <div class="text-xs text-on-surface-variant mt-0.5 leading-tight">{{ result.metric }}</div>
              </div>
            </div>

            <!-- Author -->
            <div class="flex items-center gap-4 pt-6 border-t border-outline-variant/10">
              <img [src]="testimonial.photo" [alt]="testimonial.customerName"
                   class="w-12 h-12 rounded-full object-cover border-2 border-surface-container">
              <div>
                <div class="font-bold text-on-surface text-sm font-headline">{{ testimonial.customerName }}</div>
                <div class="text-secondary text-xs font-semibold font-label uppercase tracking-wider">{{ testimonial.businessName }}</div>
              </div>
              <span *ngIf="testimonial.verified"
                    class="ml-auto bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">verified</span>
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [
    {
      id: '1',
      customerName: 'Tariq Hassan',
      businessName: 'Prestige Cuts Barbershop',
      industry: 'Barbershop · East London',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      quote: 'Before Aries Ventures we had zero online presence — people couldn\'t even find us on Google. Within 6 weeks of launching our new site we were fully booked on weekends. The booking system alone paid for itself in the first month.',
      results: [
        { metric: 'Online bookings', value: '+340%', icon: 'trending_up' },
        { metric: 'Google ranking', value: 'Top 3', icon: 'search' },
        { metric: 'Monthly revenue', value: '+£1.2k', icon: 'payments' }
      ],
      verified: true,
      date: new Date('2025-09-10')
    },
    {
      id: '2',
      customerName: 'Priya Nair',
      businessName: 'Spice Route Kitchen',
      industry: 'Restaurant · Birmingham',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      quote: 'We were relying entirely on word of mouth and Deliveroo. Aries built us a proper site with an online menu and table booking — now 30% of our covers come through our own website. The team was fast, professional, and genuinely understood what a restaurant needs.',
      results: [
        { metric: 'Direct covers/month', value: '+47', icon: 'restaurant' },
        { metric: 'Deliveroo dependency', value: '-30%', icon: 'trending_down' },
        { metric: 'Avg. delivery time', value: '4 days', icon: 'schedule' }
      ],
      verified: true,
      date: new Date('2025-11-03')
    },
    {
      id: '3',
      customerName: 'Marcus Webb',
      businessName: 'Webb & Sons Plumbing',
      industry: 'Trades · Manchester',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      quote: 'I was sceptical — I\'m a plumber, not a tech person. But the process was dead simple. They handled everything, explained it in plain English, and the site looks more professional than companies ten times our size. We\'ve picked up three commercial contracts directly from it.',
      results: [
        { metric: 'New enquiries/mo', value: '+22', icon: 'call' },
        { metric: 'Commercial contracts', value: '3 new', icon: 'business' },
        { metric: 'Quote-to-job rate', value: '68%', icon: 'handshake' }
      ],
      verified: true,
      date: new Date('2026-01-18')
    }
  ];

  ngOnInit() {
    // Add scroll reveal animation
    this.setupScrollReveal();
  }

  private setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    // Observe testimonial cards when they come into view
    setTimeout(() => {
      const cards = document.querySelectorAll('.testimonial-card');
      cards.forEach(card => observer.observe(card));
    }, 100);
  }
}