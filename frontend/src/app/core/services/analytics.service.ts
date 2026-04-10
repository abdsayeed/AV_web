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
  private sessionId = (() => {
    const k = 'av_session_id';
    return sessionStorage.getItem(k) ?? (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem(k, id);
      return id;
    })();
  })();

  init(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => this.track('page_view', { page_url: e.urlAfterRedirects }));
  }

  track(eventType: EventType, extra: Record<string, unknown> = {}): void {
    this.http.post(`${environment.apiUrl}/analytics/event/`, {
      event_type: eventType,
      page_url: window.location.pathname,
      referrer: document.referrer,
      session_id: this.sessionId,
      metadata: extra,
    }).subscribe({ error: () => {} });
  }
}
