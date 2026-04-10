import { Injectable, OnDestroy, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface WsMessage { type: string; data: unknown; }

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private authService = inject(AuthService);
  private socket: WebSocket | null = null;
  private messages$ = new Subject<WsMessage>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private url = '';

  connect(path: string): Observable<WsMessage> {
    const token = this.authService.getAccessToken();
    this.url = `${environment.wsUrl}${path}${token ? `?token=${token}` : ''}`;
    this._open();
    return this.messages$.asObservable();
  }

  send(data: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN)
      this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close(1000);
    this.socket = null;
  }

  ngOnDestroy(): void { this.disconnect(); this.messages$.complete(); }

  private _open(): void {
    if (this.socket) { this.socket.onclose = null; this.socket.close(); }
    this.socket = new WebSocket(this.url);
    this.socket.onmessage = (e) => {
      try { this.messages$.next(JSON.parse(e.data)); } catch {}
    };
    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.reconnectTimer = setTimeout(() => this._heartbeat(), 30_000);
    };
    this.socket.onclose = (e) => { if (e.code !== 1000) this._scheduleReconnect(); };
    this.socket.onerror = () => this.socket?.close();
  }

  private _heartbeat(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send('ping');
      this.reconnectTimer = setTimeout(() => this._heartbeat(), 30_000);
    }
  }

  private _scheduleReconnect(): void {
    if (this.reconnectAttempts >= 10) return;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts++), 30_000);
    this.reconnectTimer = setTimeout(() => this._open(), delay);
  }
}
