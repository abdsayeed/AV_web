import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from './websocket.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: string;
  type: 'project_update' | 'message' | 'system';
  title: string;
  body: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private ws = inject(WebSocketService);
  private auth = inject(AuthService);

  private _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = computed(() => this._notifications().filter(n => !n.is_read).length);

  connect(): void {
    if (!this.auth.isAuthenticated()) return;
    this.load();
    this.ws.connect('/ws/notifications/').subscribe(msg => {
      if (msg.type === 'notification_message')
        this._notifications.update(list => [msg.data as Notification, ...list]);
    });
  }

  load(): void {
    this.http.get<{ unread_count: number; results: Notification[] }>(
      `${environment.apiUrl}/notifications/`
    ).subscribe(res => this._notifications.set(res.results));
  }

  markRead(id: string): void {
    this.http.patch(`${environment.apiUrl}/notifications/${id}/read/`, {}).subscribe(() =>
      this._notifications.update(list => list.map(n => n.id === id ? { ...n, is_read: true } : n))
    );
  }
}
