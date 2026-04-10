import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActivityNotification {
  id: string;
  type: 'signup' | 'project_started' | 'project_completed' | 'quote_requested';
  message: string;
  location: string;
  timeAgo: string;
  icon: string;
  customerName: string;
}

@Component({
  selector: 'app-live-activity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Live Activity Notification -->
    <div *ngIf="currentNotification && showNotification" 
         class="activity-notification fixed bottom-6 left-6 z-50 max-w-sm"
         [@slideIn]>
      
      <div class="notification-card bg-white rounded-xl shadow-2xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-3xl transition-all duration-300">
        <!-- Icon -->
        <div class="notification-icon text-2xl flex-shrink-0 animate-bounce">
          {{ currentNotification.icon }}
        </div>
        
        <!-- Content -->
        <div class="notification-content flex-1 min-w-0">
          <p class="notification-message text-sm font-medium text-gray-900 leading-tight">
            {{ currentNotification.message }}
          </p>
          <div class="notification-meta flex items-center gap-2 mt-1">
            <span class="time text-xs text-gray-500">{{ currentNotification.timeAgo }}</span>
            <span class="location text-xs text-blue-600 font-medium">{{ currentNotification.location }}</span>
          </div>
        </div>
        
        <!-- Close Button -->
        <button (click)="hideNotification()" 
                class="close-btn text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Progress Bar -->
      <div class="progress-bar w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div class="progress-fill h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100 ease-linear"
             [style.width.%]="progressWidth"></div>
      </div>
    </div>
  `,
  styles: [`
    .activity-notification {
      animation: slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideInLeft {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-card {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }

    .notification-card:hover {
      transform: translateY(-2px);
    }

    .progress-fill {
      animation: progressAnimation 5s linear;
    }

    @keyframes progressAnimation {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
      .activity-notification {
        left: 1rem;
        right: 1rem;
        max-width: none;
      }
    }
  `]
})
export class LiveActivityComponent implements OnInit, OnDestroy {
  currentNotification: ActivityNotification | null = null;
  showNotification = false;
  progressWidth = 100;
  
  private notificationTimer: any;
  private progressTimer: any;
  private cycleTimer: any;

  private activities: ActivityNotification[] = [
    {
      id: '1',
      type: 'project_started',
      message: 'Tariq from East London just submitted a barbershop project',
      location: 'East London, UK',
      timeAgo: '3 minutes ago',
      icon: '✂️',
      customerName: 'Tariq'
    },
    {
      id: '2',
      type: 'project_completed',
      message: 'Priya\'s restaurant website just went live',
      location: 'Birmingham, UK',
      timeAgo: '6 minutes ago',
      icon: '🍽️',
      customerName: 'Priya'
    },
    {
      id: '3',
      type: 'quote_requested',
      message: 'Marcus requested a quote for a trades website',
      location: 'Manchester, UK',
      timeAgo: '11 minutes ago',
      icon: '🔧',
      customerName: 'Marcus'
    },
    {
      id: '4',
      type: 'project_started',
      message: 'Aisha chose the Fully Managed plan for her salon',
      location: 'Leeds, UK',
      timeAgo: '14 minutes ago',
      icon: '💇',
      customerName: 'Aisha'
    },
    {
      id: '5',
      type: 'project_completed',
      message: 'Raj\'s takeaway site is now taking online orders',
      location: 'Leicester, UK',
      timeAgo: '19 minutes ago',
      icon: '🛵',
      customerName: 'Raj'
    },
    {
      id: '6',
      type: 'quote_requested',
      message: 'Connor requested a quote for a landscaping site',
      location: 'Glasgow, UK',
      timeAgo: '24 minutes ago',
      icon: '🌿',
      customerName: 'Connor'
    }
  ];

  private currentIndex = 0;

  ngOnInit() {
    // Start showing notifications after a delay
    setTimeout(() => {
      this.startNotificationCycle();
    }, 3000);
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  private startNotificationCycle() {
    this.showNextNotification();
    
    // Cycle through notifications every 8 seconds
    this.cycleTimer = setInterval(() => {
      this.showNextNotification();
    }, 8000);
  }

  private showNextNotification() {
    // Hide current notification first
    this.hideNotification();
    
    setTimeout(() => {
      // Show next notification
      this.currentNotification = this.activities[this.currentIndex];
      this.showNotification = true;
      this.progressWidth = 100;
      
      // Start progress animation
      this.startProgressAnimation();
      
      // Auto-hide after 5 seconds
      this.notificationTimer = setTimeout(() => {
        this.hideNotification();
      }, 5000);
      
      // Move to next notification
      this.currentIndex = (this.currentIndex + 1) % this.activities.length;
    }, 300);
  }

  private startProgressAnimation() {
    this.progressWidth = 100;
    
    // Animate progress bar
    this.progressTimer = setInterval(() => {
      this.progressWidth -= 2;
      if (this.progressWidth <= 0) {
        clearInterval(this.progressTimer);
      }
    }, 100);
  }

  hideNotification() {
    this.showNotification = false;
    this.clearTimers();
  }

  private clearTimers() {
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
  }

  // Generate random activities (for demo purposes)
  private generateRandomActivity(): ActivityNotification {
    const names = ['Alex', 'Sophie', 'Ryan', 'Chloe', 'Nathan', 'Zoe', 'Oliver', 'Grace'];
    const locations = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol', 'Sheffield'];
    const activities = [
      { type: 'project_started', message: 'just started a project with us', icon: '🎉' },
      { type: 'quote_requested', message: 'requested a quote', icon: '📝' },
      { type: 'signup', message: 'signed up for our newsletter', icon: '📧' },
      { type: 'project_completed', message: '\'s website just went live', icon: '✨' }
    ];

    const name = names[Math.floor(Math.random() * names.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const timeAgo = Math.floor(Math.random() * 30) + 1;

    return {
      id: Date.now().toString(),
      type: activity.type as any,
      message: `${name} ${activity.message}`,
      location: `${location}, UK`,
      timeAgo: `${timeAgo} minutes ago`,
      icon: activity.icon,
      customerName: name
    };
  }
}