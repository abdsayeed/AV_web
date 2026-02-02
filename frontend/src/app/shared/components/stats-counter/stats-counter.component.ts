import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LiveStats {
  icon: string;
  value: number;
  displayValue: string;
  label: string;
  suffix?: string;
  animatedValue?: number;
}

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-section bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 py-20 relative overflow-hidden" #statsSection>
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div class="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
        <div class="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        <div class="absolute bottom-10 right-10 w-20 h-20 bg-white rounded-full"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Businesses Worldwide
          </h2>
          <p class="text-xl text-blue-100 max-w-3xl mx-auto">
            Join hundreds of successful businesses who have transformed their online presence with us
          </p>
        </div>

        <div class="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div *ngFor="let stat of stats; let i = index" 
               class="stat-item text-center group"
               [style.animation-delay]="i * 200 + 'ms'">
            
            <!-- Icon with Animation -->
            <div class="stat-icon mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <span class="material-symbols-outlined text-6xl md:text-7xl text-white">{{ stat.icon }}</span>
            </div>
            
            <!-- Animated Counter -->
            <div class="stat-value text-4xl md:text-5xl font-bold text-white mb-2 font-mono">
              {{ stat.animatedValue || 0 }}{{ stat.suffix || '' }}
            </div>
            
            <!-- Label -->
            <div class="stat-label text-lg md:text-xl text-blue-100 font-medium">
              {{ stat.label }}
            </div>

            <!-- Decorative Line -->
            <div class="w-16 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-4 opacity-50"></div>
          </div>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-16 text-center">
          <div class="flex flex-wrap justify-center items-center gap-8 text-blue-100">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl">emoji_events</span>
              <span class="font-medium">Award Winning</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl">bolt</span>
              <span class="font-medium">14-Day Delivery</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl">shield</span>
              <span class="font-medium">100% Satisfaction</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl">public</span>
              <span class="font-medium">Global Reach</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-section {
      position: relative;
    }

    .stats-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
      pointer-events: none;
    }

    .stat-item {
      opacity: 0;
      transform: translateY(30px);
      animation: fadeInUp 0.8s ease forwards;
    }

    .stat-item:hover .stat-icon {
      animation: bounce 0.6s ease;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0) scale(1);
      }
      40%, 43% {
        transform: translate3d(0, -8px, 0) scale(1.1);
      }
      70% {
        transform: translate3d(0, -4px, 0) scale(1.05);
      }
      90% {
        transform: translate3d(0, -2px, 0) scale(1.02);
      }
    }

    @keyframes countUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .stat-value {
      animation: countUp 0.5s ease;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .stats-grid {
        gap: 2rem;
      }
      
      .stat-icon {
        font-size: 3rem;
      }
      
      .stat-value {
        font-size: 2.5rem;
      }
    }
  `]
})
export class StatsCounterComponent implements OnInit {
  @ViewChild('statsSection', { static: true }) statsSection!: ElementRef;

  stats: LiveStats[] = [
    {
      icon: 'rocket_launch',
      value: 150,
      displayValue: '150+',
      label: 'Projects Completed',
      suffix: '+',
      animatedValue: 0
    },
    {
      icon: 'sentiment_satisfied',
      value: 142,
      displayValue: '142',
      label: 'Happy Clients',
      animatedValue: 0
    },
    {
      icon: 'star',
      value: 4.9,
      displayValue: '4.9/5',
      label: 'Average Rating',
      animatedValue: 0
    },
    {
      icon: 'schedule',
      value: 3,
      displayValue: '3+',
      label: 'Years Experience',
      suffix: '+',
      animatedValue: 0
    }
  ];

  private hasAnimated = false;

  ngOnInit() {
    this.setupScrollAnimation();
  }

  private setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateCounters();
        }
      });
    }, {
      threshold: 0.3
    });

    observer.observe(this.statsSection.nativeElement);
  }

  private animateCounters() {
    this.stats.forEach((stat, index) => {
      setTimeout(() => {
        this.animateCounter(stat);
      }, index * 200);
    });
  }

  private animateCounter(stat: LiveStats) {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = stat.value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      
      if (step >= steps) {
        current = stat.value;
        clearInterval(timer);
      }

      // Format the animated value
      if (stat.label === 'Average Rating') {
        stat.animatedValue = Math.round(current * 10) / 10;
      } else {
        stat.animatedValue = Math.floor(current);
      }
    }, duration / steps);
  }
}