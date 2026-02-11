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
    <section class="testimonials-section py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. See how we've helped businesses like yours achieve remarkable results.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let testimonial of testimonials" 
               class="testimonial-card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 relative overflow-hidden group">
            
            <!-- Background Pattern -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            
            <!-- Header -->
            <div class="testimonial-header flex items-center mb-6 relative z-10">
              <img [src]="testimonial.photo" 
                   [alt]="testimonial.customerName"
                   class="customer-photo w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg">
              
              <div class="customer-info ml-4 flex-1">
                <h4 class="font-bold text-gray-900 text-lg">{{ testimonial.customerName }}</h4>
                <p class="business-name text-blue-600 font-medium">{{ testimonial.businessName }}</p>
                <div class="rating flex mt-1">
                  <span *ngFor="let star of [1,2,3,4,5]"
                        [class]="star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'"
                        class="material-symbols-outlined text-lg">star</span>
                </div>
              </div>
              
              <span *ngIf="testimonial.verified" 
                    class="verified-badge bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-green-600">verified</span>
                Verified
              </span>
            </div>

            <!-- Quote -->
            <blockquote class="testimonial-quote text-gray-700 text-base leading-relaxed mb-6 relative z-10">
              <span class="text-4xl text-blue-200 absolute -top-2 -left-2">"</span>
              <span class="relative z-10">{{ testimonial.quote }}</span>
            </blockquote>

            <!-- Results -->
            <div class="results-grid grid grid-cols-1 gap-3 mb-6 relative z-10">
              <div *ngFor="let result of testimonial.results" 
                   class="result-metric bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 flex items-center gap-3">
                <span class="material-symbols-outlined text-2xl text-blue-600">{{ result.icon }}</span>
                <div class="flex-1">
                  <div class="value text-xl font-bold text-blue-600">{{ result.value }}</div>
                  <div class="metric text-sm text-gray-600">{{ result.metric }}</div>
                </div>
              </div>
            </div>

            <!-- Video Button -->
            <button *ngIf="testimonial.videoUrl" 
                    class="watch-video-btn w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 relative z-10">
              <span class="material-symbols-outlined text-lg">play_circle</span>
              Watch Video Testimonial
            </button>

            <!-- Industry Badge -->
            <div class="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-xs font-medium text-gray-600 px-3 py-1 rounded-full">
              {{ testimonial.industry }}
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center mt-16">
          <div class="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p class="text-gray-600 mb-6">
              Let's create your next success story. Get started with a free consultation today.
            </p>
            <button class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonial-card {
      transform: translateY(0);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .testimonial-card:hover {
      transform: translateY(-8px);
    }

    .customer-photo {
      transition: transform 0.3s ease;
    }

    .testimonial-card:hover .customer-photo {
      transform: scale(1.1);
    }

    .result-metric {
      transition: all 0.3s ease;
    }

    .result-metric:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .testimonial-card {
      animation: fadeInUp 0.6s ease forwards;
    }

    .testimonial-card:nth-child(2) {
      animation-delay: 0.1s;
    }

    .testimonial-card:nth-child(3) {
      animation-delay: 0.2s;
    }
  `]
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      businessName: 'The Modern Barber Shop',
      industry: 'Beauty & Grooming',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      quote: 'Within 3 months of launching our new website with Aries Ventures, we saw a 45% increase in online bookings. The design perfectly captures our brand, and customers constantly compliment how easy it is to book appointments.',
      results: [
        { metric: 'Increase in bookings', value: '+45%', icon: 'trending_up' },
        { metric: 'Customer satisfaction', value: '4.9/5', icon: 'star' },
        { metric: 'Mobile conversions', value: '+60%', icon: 'smartphone' }
      ],
      verified: true,
      date: new Date('2024-10-15')
    },
    {
      id: '2',
      customerName: 'Michael Chen',
      businessName: 'Chen\'s Coffee House',
      industry: 'Food & Beverage',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      quote: 'Our online orders tripled after the website redesign. The ordering system is so intuitive, and the mobile experience is flawless. Aries Ventures understood our vision perfectly.',
      results: [
        { metric: 'Online orders', value: '+200%', icon: 'shopping_cart' },
        { metric: 'Average order value', value: '+35%', icon: 'payments' },
        { metric: 'Customer retention', value: '+50%', icon: 'refresh' }
      ],
      verified: true,
      date: new Date('2024-09-22')
    },
    {
      id: '3',
      customerName: 'Emma Thompson',
      businessName: 'Thompson Legal Services',
      industry: 'Legal Services',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      quote: 'Professional, reliable, and results-driven. Our new website has positioned us as the go-to legal firm in our area. Client inquiries have increased by 80% since launch.',
      results: [
        { metric: 'Client inquiries', value: '+80%', icon: 'call' },
        { metric: 'Consultation bookings', value: '+65%', icon: 'event' },
        { metric: 'Professional credibility', value: '10/10', icon: 'balance' }
      ],
      verified: true,
      date: new Date('2024-11-05')
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