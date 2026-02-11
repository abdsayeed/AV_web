import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

export interface User {
  id?: string;
  email: string;
  name: string;
  picture?: string;
  auth_provider?: 'jwt';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean; // Track loading state
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true // Start as loading
  });

  public authState$ = this.authStateSubject.asObservable();
  public isAuthenticated$ = this.authState$.pipe(map(state => state.isAuthenticated));
  public user$ = this.authState$.pipe(map(state => state.user));
  public isLoading$ = this.authState$.pipe(map(state => state.isLoading));

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    // Check for existing JWT token
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    if (token) {
      // Validate token with backend
      this.handleJWTAuthentication(token).subscribe({
        next: () => {
          // Token validated successfully
        },
        error: () => {
          // Token validation failed, clear auth state
          this.updateAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false
          });
        }
      });
    } else {
      // No token, user is not authenticated
      this.updateAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false
      });
    }
  }

  private handleJWTAuthentication(token: string): Observable<any> {
    return this.apiService.getProfile().pipe(
      tap((response) => {
        if (response.success) {
          this.updateAuthState({
            isAuthenticated: true,
            user: { ...response.user, auth_provider: 'jwt' },
            token,
            isLoading: false
          });
        } else {
          throw new Error('Profile fetch failed');
        }
      }),
      catchError((error) => {
        console.error('Token validation failed:', error);
        this.clearLocalAuthData();
        return throwError(() => error);
      })
    );
  }

  private updateAuthState(state: AuthState) {
    this.authStateSubject.next(state);
  }

  // JWT Login Methods
  loginWithCustom(email: string, password: string): Observable<any> {
    // Validate email format
    if (!this.isValidEmail(email)) {
      return throwError(() => ({ 
        success: false, 
        message: 'Please enter a valid email address' 
      }));
    }

    // Validate password
    if (!password || password.length < 6) {
      return throwError(() => ({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      }));
    }

    return this.apiService.login({ email, password }).pipe(
      tap((response) => {
        if (response.success && response.tokens) {
          // Store tokens in both formats for compatibility
          localStorage.setItem('token', response.tokens.access);
          localStorage.setItem('accessToken', response.tokens.access);
          localStorage.setItem('refreshToken', response.tokens.refresh);
          this.updateAuthState({
            isAuthenticated: true,
            user: { ...response.user, auth_provider: 'jwt' },
            token: response.tokens.access,
            isLoading: false
          });
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }),
      catchError((error) => {
        // Handle network errors
        if (!navigator.onLine) {
          return throwError(() => ({ 
            success: false, 
            message: 'No internet connection. Please check your network.' 
          }));
        }
        
        // Handle API errors
        const errorMessage = error.error?.message || error.message || 'Login failed. Please try again.';
        return throwError(() => ({ 
          success: false, 
          message: errorMessage 
        }));
      })
    );
  }

  registerWithCustom(userData: any): Observable<any> {
    // Validate email format
    if (!this.isValidEmail(userData.email)) {
      return throwError(() => ({ 
        success: false, 
        message: 'Please enter a valid email address' 
      }));
    }

    // Validate password strength
    if (!userData.password || userData.password.length < 8) {
      return throwError(() => ({ 
        success: false, 
        message: 'Password must be at least 8 characters' 
      }));
    }

    // Validate password match
    if (userData.password !== userData.confirm_password) {
      return throwError(() => ({ 
        success: false, 
        message: 'Passwords do not match' 
      }));
    }

    return this.apiService.register(userData).pipe(
      tap((response) => {
        if (response.success && response.tokens) {
          // Store tokens in both formats for compatibility
          localStorage.setItem('token', response.tokens.access);
          localStorage.setItem('accessToken', response.tokens.access);
          localStorage.setItem('refreshToken', response.tokens.refresh);
          this.updateAuthState({
            isAuthenticated: true,
            user: { ...response.user, auth_provider: 'jwt' },
            token: response.tokens.access,
            isLoading: false
          });
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      }),
      catchError((error) => {
        // Handle network errors
        if (!navigator.onLine) {
          return throwError(() => ({ 
            success: false, 
            message: 'No internet connection. Please check your network.' 
          }));
        }
        
        // Handle API errors
        const errorMessage = error.error?.message || error.message || 'Registration failed. Please try again.';
        return throwError(() => ({ 
          success: false, 
          message: errorMessage 
        }));
      })
    );
  }

  // Universal Logout
  logout(): void {
    // Call API logout endpoint with proper cleanup
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      // Use finalize to ensure cleanup happens regardless of success/failure
      this.apiService.logout().pipe(
        finalize(() => {
          // Always clear local data
          this.clearLocalAuthData();
        })
      ).subscribe({
        next: () => {
          console.log('API logout successful');
        },
        error: (error) => {
          console.error('API logout error:', error);
          // Still clear local data even if API call fails
        }
      });
    } else {
      // No refresh token, just clear local data
      this.clearLocalAuthData();
    }
  }

  private clearLocalAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false
    });
    this.router.navigate(['/']);
  }

  // Utility Methods
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  isLoading(): boolean {
    return this.authStateSubject.value.isLoading;
  }

  // Email validation helper
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password Reset
  resetPassword(email: string): Observable<any> {
    if (!this.isValidEmail(email)) {
      return throwError(() => ({ 
        success: false, 
        message: 'Please enter a valid email address' 
      }));
    }

    return this.apiService.requestPasswordReset(email).pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          return throwError(() => ({ 
            success: false, 
            message: 'No internet connection. Please check your network.' 
          }));
        }
        return throwError(() => error);
      })
    );
  }

  // Change Password
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    if (!oldPassword || !newPassword) {
      return throwError(() => ({ 
        success: false, 
        message: 'Please fill in all password fields' 
      }));
    }

    if (newPassword.length < 8) {
      return throwError(() => ({ 
        success: false, 
        message: 'New password must be at least 8 characters' 
      }));
    }

    if (oldPassword === newPassword) {
      return throwError(() => ({ 
        success: false, 
        message: 'New password must be different from old password' 
      }));
    }

    return this.apiService.changePassword({
      current_password: oldPassword,
      new_password: newPassword,
      confirm_password: newPassword
    }).pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          return throwError(() => ({ 
            success: false, 
            message: 'No internet connection. Please check your network.' 
          }));
        }
        return throwError(() => error);
      })
    );
  }
}