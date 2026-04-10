import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'customer' | 'staff' | 'admin';
  is_verified: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _state = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  authState$ = this._state.asObservable();
  isAuthenticated$ = this._state.pipe(map(s => s.isAuthenticated));
  user$ = this._state.pipe(map(s => s.user));

  // Signals for Angular 18 signal-based components
  readonly authSignal = signal<AuthState>({ isAuthenticated: false, user: null, isLoading: true });
  readonly isAuthenticatedSignal = computed(() => this.authSignal().isAuthenticated);
  readonly userSignal = computed(() => this.authSignal().user);

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage(): void {
    const stored = localStorage.getItem('currentUser');
    const token = localStorage.getItem('accessToken');
    if (stored && token) {
      try {
        const user = JSON.parse(stored) as User;
        this._setState({ isAuthenticated: true, user, isLoading: false });
      } catch {
        this._clearStorage();
        this._setState({ isAuthenticated: false, user: null, isLoading: false });
      }
    } else {
      this._setState({ isAuthenticated: false, user: null, isLoading: false });
    }
  }

  loginWithCustom(email: string, password: string): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ access: string; refresh: string; user: User }>(
      `${environment.apiUrl}/auth/login/`,
      { email, password },
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.access);
        localStorage.setItem('refreshToken', res.refresh);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        this._setState({ isAuthenticated: true, user: res.user, isLoading: false });
      }),
      map(() => ({ success: true })),
      catchError(err => {
        const msg = err.error?.detail || err.error?.non_field_errors?.[0] || 'Login failed';
        return throwError(() => ({ message: msg }));
      }),
    );
  }

  registerWithCustom(data: {
    name: string; email: string; password: string;
    confirm_password: string; business_name?: string;
  }): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ access: string; refresh: string; user: User }>(
      `${environment.apiUrl}/auth/register/`,
      data,
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.access);
        localStorage.setItem('refreshToken', res.refresh);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        this._setState({ isAuthenticated: true, user: res.user, isLoading: false });
      }),
      map(() => ({ success: true })),
      catchError(err => {
        const errors = err.error;
        const msg = errors?.email?.[0] || errors?.password?.[0] || errors?.detail || 'Registration failed';
        return throwError(() => ({ message: msg }));
      }),
    );
  }

  refreshToken(): Observable<string> {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return throwError(() => new Error('No refresh token'));

    return this.http.post<{ access: string; refresh: string }>(
      `${environment.apiUrl}/auth/token/refresh/`,
      { refresh },
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.access);
        if (res.refresh) localStorage.setItem('refreshToken', res.refresh);
      }),
      map(res => res.access),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      }),
    );
  }

  resetPassword(email: string): Observable<{ success: boolean }> {
    return this.http.post<{ detail: string }>(
      `${environment.apiUrl}/auth/forgot-password/`,
      { email },
    ).pipe(
      map(() => ({ success: true })),
      catchError(() => of({ success: true })), // Always succeed to prevent enumeration
    );
  }

  logout(): void {
    this._clearStorage();
    this._setState({ isAuthenticated: false, user: null, isLoading: false });
    this.router.navigate(['/']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return this._state.getValue().isAuthenticated;
  }

  private _setState(state: AuthState): void {
    this._state.next(state);
    this.authSignal.set(state);
  }

  private _clearStorage(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  }
}
