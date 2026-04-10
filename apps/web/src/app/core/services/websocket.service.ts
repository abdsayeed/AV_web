import { Injectable, OnDestroy, inject } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface WsMessage {
  type: string;
  data: unknown;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private authService = inject(AuthService);
  private socket: WebSocket | null = null;
  private messages$ = new Subject<WsMessage>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private url = '';

  /** Connect to a WebSocket endpoint. Token is appended as ?token= query param. */
  connect(path: string): Observable<WsMessage> {
    const token = this.authService.getAccessToken();
    this.url = `${environment.wsUrl}${path}${token ? `?token=${token}` : ''}`;
    this._open();
    return this.messages$.asObservable();
  }

  send(data: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }

  disconnect(): void {
    this._clearReconnect();
    this.socket?.close(1000, 'Client disconnect');
    this.socket = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.messages$.complete();
  }

  private _open(): void {
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
    }

    this.socket = new WebSocket(this.url);

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        this.messages$.next(parsed);
      } catch {
        // pong or plain text — ignore
      }
    };

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      // Heartbeat every 30s
      this._startHeartbeat();
    };

    this.socket.onclose = (event) => {
      if (event.code !== 1000) {
        this._scheduleReconnect();
      }
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  private _startHeartbeat(): void {
    const ping = () => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send('ping');
        this.reconnectTimer = setTimeout(ping, 30_000);
      }
    };
    this.reconnectTimer = setTimeout(ping, 30_000);
  }

  private _scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    // Exponential backoff: 1s, 2s, 4s … capped at 30s
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30_000);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this._open(), delay);
  }

  private _clearReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
