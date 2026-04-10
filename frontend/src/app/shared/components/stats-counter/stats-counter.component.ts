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
    <section class="py-12 bg-surface-container-low" #statsSection>
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div *ngFor="let stat of stats; let i = index"
               class="stat-item text-center group"
               [style.animation-delay]="i * 150 + 'ms'">
            <div class="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tighter mb-1">
              {{ stat.animatedValue || 0 }}{{ stat.suffix || '' }}
            </div>
            <div class="text-sm font-semibold text-on-surface-variant uppercase tracking-widest font-label">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stat-item {
      opacity: 0;
      transform: translateY(16px);
      animation: fadeInUp 0.6s ease forwards;
    }
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class StatsCounterComponent implements OnInit {
  @ViewChild('statsSection', { static: true }) statsSection!: ElementRef;

  stats: LiveStats[] = [
    {
      icon: 'rocket_launch',
      value: 50,
      displayValue: '50+',
      label: 'Businesses Launched',
      suffix: '+',
      animatedValue: 0
    },
    {
      icon: 'sentiment_satisfied',
      value: 47,
      displayValue: '47',
      label: 'Active Clients',
      animatedValue: 0
    },
    {
      icon: 'star',
      value: 4.9,
      displayValue: '4.9',
      label: 'Average Rating',
      animatedValue: 0
    },
    {
      icon: 'schedule',
      value: 4,
      displayValue: '4',
      label: 'Days Avg. Delivery',
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