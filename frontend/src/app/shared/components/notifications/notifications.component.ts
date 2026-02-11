import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <div *ngFor="let notification of notificationService.notifications$(); trackBy: trackByFn"
           class="notification-card animate-slide-in-right"
           [ngClass]="getNotificationClasses(notification)">
        
        <!-- Icon -->
        <div class="flex-shrink-0">
          <span class="text-xl">{{ getIcon(notification.type) }}</span>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-sm">{{ notification.title }}</h4>
          <p *ngIf="notification.message" class="text-xs opacity-90 mt-1">
            {{ notification.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button (click)="notificationService.remove(notification.id)"
                class="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity">
          <span class="text-lg">✕</span>
        </button>

      </div>
    </div>
  `,
  styles: [`
    .notification-card {
      @apply flex items-start gap-3 p-4 rounded-xl shadow-lg backdrop-blur-sm border;
      @apply transition-all duration-300 hover:shadow-xl;
    }

    .notification-success {
      @apply bg-green-500/20 border-green-500/30 text-green-100;
    }

    .notification-error {
      @apply bg-red-500/20 border-red-500/30 text-red-100;
    }

    .notification-warning {
      @apply bg-yellow-500/20 border-yellow-500/30 text-yellow-100;
    }

    .notification-info {
      @apply bg-blue-500/20 border-blue-500/30 text-blue-100;
    }

    .animate-slide-in-right {
      animation: slideInRight 0.3s ease-out;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);

  getNotificationClasses(notification: Notification): string {
    return `notification-${notification.type}`;
  }

  getIcon(type: Notification['type']): string {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type];
  }

  trackByFn(index: number, notification: Notification): string {
    return notification.id;
  }
}