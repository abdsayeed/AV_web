import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

type EventType = 'page_view' | 'cta_click' | 'form_start' | 'form_complete' | 'template_view' | 'demo_click';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private sessionId = this._generateSessionId();

  /** Call once in AppComponent.ngOnInit() */
  init(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.track('page_view', { page_url: e.urlAfterRedirects });
    });
  }

  track(eventType: EventType, extra: Record<string, unknown> = {}): void {
    const payload = {
      event_type: eventType,
      page_url: window.location.pathname,
      referrer: document.referrer,
      session_id: this.sessionId,
      metadata: extra,
    };
    // Fire-and-forget — don't block the UI
    this.http.post(`${environment.apiUrl}/analytics/event/`, payload).subscribe({
      error: () => {} // Silently ignore analytics failures
    });
  }

  private _generateSessionId(): string {
    const stored = sessionStorage.getItem('av_session_id');
    if (stored) return stored;
    const id = crypto.randomUUID();
    sessionStorage.setItem('av_session_id', id);
    return id;
  }
}
