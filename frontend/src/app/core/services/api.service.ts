import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ContactFormData } from '../models/contact-form.model';

export interface User {
  id: string;
  email: string;
  name: string;
  business_name?: string;
  phone?: string;
  avatar?: string;
  role: string;
  is_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  referenceNumber: string;
  data: {
    id: string;
    reference_number: string;
    business_name: string;
    estimated_response_time: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Authentication Methods
  register(userData: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    business_name?: string;
    phone?: string;
    marketing_emails?: boolean;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register/`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.tokens) {
            this.setAuthData(response.user, response.tokens);
          }
        }),
        catchError(this.handleError)
      );
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.tokens) {
            this.setAuthData(response.user, response.tokens);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<ApiResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/logout/`, {
      refresh_token: refreshToken
    }).pipe(
      tap(() => {
        this.clearAuthData();
      }),
      catchError(this.handleError)
    );
  }

  getProfile(): Observable<{ success: boolean; user: User }> {
    return this.http.get<{ success: boolean; user: User }>(`${this.apiUrl}/auth/profile/`)
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUserSubject.next(response.user);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }),
        catchError(this.handleError)
      );
  }

  updateProfile(userData: Partial<User>): Observable<{ success: boolean; user: User; message: string }> {
    return this.http.put<{ success: boolean; user: User; message: string }>(`${this.apiUrl}/auth/profile/`, userData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUserSubject.next(response.user);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }),
        catchError(this.handleError)
      );
  }

  changePassword(passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/change-password/`, passwordData)
      .pipe(catchError(this.handleError));
  }

  requestPasswordReset(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/password-reset/`, { email })
      .pipe(catchError(this.handleError));
  }

  confirmPasswordReset(resetData: {
    token: string;
    new_password: string;
    confirm_password: string;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/password-reset/confirm/`, resetData)
      .pipe(catchError(this.handleError));
  }

  verifyEmail(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/verify-email/`, { token })
      .pipe(catchError(this.handleError));
  }

  resendVerification(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/resend-verification/`, {})
      .pipe(catchError(this.handleError));
  }

  // Social Login Method
  socialLogin(socialData: {
    email: string;
    name: string;
    auth_provider: string;
    social_id: string;
    avatar?: string;
    first_name?: string;
    last_name?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/social-login/`, socialData)
      .pipe(
        tap(response => {
          if (response.success && response.tokens) {
            this.setAuthData(response.user, response.tokens);
          }
        }),
        catchError(this.handleError)
      );
  }
  syncAuth0User(auth0User: {
    id?: string;
    email: string;
    name: string;
    picture?: string;
    auth_provider?: string;
    auth0_sub?: string;
  }): Observable<{ success: boolean; user: User }> {
    return this.http.post<{ success: boolean; user: User }>(`${this.apiUrl}/auth/auth0/sync/`, auth0User)
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUserSubject.next(response.user);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }),
        catchError(this.handleError)
      );
  }

  validateAuth0Token(token: string): Observable<{ success: boolean; user: User }> {
    return this.http.post<{ success: boolean; user: User }>(`${this.apiUrl}/auth/auth0/validate/`, { token })
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUserSubject.next(response.user);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }),
        catchError(this.handleError)
      );
  }

  // Contact Form Methods
  submitContactForm(formData: ContactFormData): Observable<ContactSubmissionResponse> {
    return this.http.post<ContactSubmissionResponse>(`${this.apiUrl}/contact/submit/`, formData)
      .pipe(catchError(this.handleError));
  }

  lookupSubmission(referenceNumber: string, email: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/contact/lookup/`, {
      params: { reference: referenceNumber, email }
    }).pipe(catchError(this.handleError));
  }

  // Templates Methods
  getTemplates(filters?: { industry?: string; is_featured?: boolean }): Observable<ApiResponse> {
    let params: any = {};
    if (filters) {
      if (filters.industry) params.industry = filters.industry;
      if (filters.is_featured !== undefined) params.is_featured = filters.is_featured;
    }
    
    return this.http.get<ApiResponse>(`${this.apiUrl}/templates/`, { params })
      .pipe(catchError(this.handleError));
  }

  getTemplate(slug: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/templates/${slug}/`)
      .pipe(catchError(this.handleError));
  }

  // Pricing Methods
  getPricingPlans(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pricing/plans/`)
      .pipe(catchError(this.handleError));
  }

  getPricingPlan(slug: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pricing/plans/${slug}/`)
      .pipe(catchError(this.handleError));
  }

  // Analytics Methods
  trackEvent(eventData: {
    event: string;
    category: string;
    label?: string;
    value?: number;
    metadata?: any;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/analytics/track/`, eventData)
      .pipe(catchError(this.handleError));
  }

  // Email validation (keeping the same interface as MockApiService)
  validateEmail(email: string): Observable<{ valid: boolean; suggestion?: string }> {
    // Simple client-side validation for now
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    // Basic domain suggestions
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    let suggestion: string | undefined;
    
    if (isValid) {
      const domain = email.split('@')[1];
      if (domain && !commonDomains.includes(domain.toLowerCase())) {
        // Simple typo detection for common domains
        const typoMap: { [key: string]: string } = {
          'gmial.com': 'gmail.com',
          'gmai.com': 'gmail.com',
          'yahooo.com': 'yahoo.com',
          'outlok.com': 'outlook.com',
          'hotmial.com': 'hotmail.com'
        };
        suggestion = typoMap[domain.toLowerCase()];
      }
    }
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ valid: isValid, suggestion });
        observer.complete();
      }, 300);
    });
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  private setAuthData(user: User, tokens: { access: string; refresh: string }): void {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors) {
        // Handle validation errors
        const errors = error.error.errors;
        if (typeof errors === 'object') {
          const firstError = Object.values(errors)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else {
            errorMessage = String(firstError);
          }
        }
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}