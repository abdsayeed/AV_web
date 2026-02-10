import { Injectable, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { SocialAuthService, SocialUser } from './social-auth.service';
import { environment } from '../../../environments/environment';

export interface User {
  id?: string;
  email: string;
  name: string;
  picture?: string;
  auth_provider?: 'auth0' | 'custom';
  auth0_sub?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  provider: 'auth0' | 'custom' | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth0 = inject(Auth0Service);
  private apiService = inject(ApiService);
  private socialAuthService = inject(SocialAuthService);
  private router = inject(Router);

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    provider: null
  });

  public authState$ = this.authStateSubject.asObservable();
  public isAuthenticated$ = this.authState$.pipe(map(state => state.isAuthenticated));
  public user$ = this.authState$.pipe(map(state => state.user));

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    // Check for existing custom JWT token
    const customToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    // Combine Auth0 and custom auth states
    combineLatest([
      this.auth0.isAuthenticated$,
      this.auth0.user$,
      this.auth0.getAccessTokenSilently().pipe(catchError(() => of(null)))
    ]).pipe(
      switchMap(([isAuth0Authenticated, auth0User, auth0Token]) => {
        if (isAuth0Authenticated && auth0User && auth0Token) {
          // User is authenticated with Auth0
          return this.handleAuth0Authentication(auth0User, auth0Token);
        } else if (customToken) {
          // User might be authenticated with custom JWT
          return this.handleCustomAuthentication(customToken);
        } else {
          // User is not authenticated
          this.updateAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            provider: null
          });
          return of(null);
        }
      })
    ).subscribe();
  }

  private handleAuth0Authentication(auth0User: any, token: string): Observable<any> {
    const user: User = {
      id: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name || auth0User.nickname,
      picture: auth0User.picture,
      auth_provider: 'auth0',
      auth0_sub: auth0User.sub
    };

    // Sync Auth0 user with backend
    return this.apiService.syncAuth0User(user).pipe(
      tap((backendUser) => {
        this.updateAuthState({
          isAuthenticated: true,
          user: { ...user, ...backendUser },
          token,
          provider: 'auth0'
        });
      }),
      catchError((error) => {
        console.error('Error syncing Auth0 user:', error);
        this.updateAuthState({
          isAuthenticated: true,
          user,
          token,
          provider: 'auth0'
        });
        return of(user);
      })
    );
  }

  private handleCustomAuthentication(token: string): Observable<any> {
    return this.apiService.getProfile().pipe(
      tap((response) => {
        if (response.success) {
          this.updateAuthState({
            isAuthenticated: true,
            user: { ...response.user, auth_provider: 'custom' },
            token,
            provider: 'custom'
          });
        }
      }),
      catchError((error) => {
        console.error('Custom token validation failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          provider: null
        });
        return of(null);
      })
    );
  }

  private updateAuthState(state: AuthState) {
    this.authStateSubject.next(state);
  }

  // Auth0 Login Methods
  loginWithAuth0() {
    this.auth0.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'login'
      }
    });
  }

  loginWithAuth0Popup() {
    return this.auth0.loginWithPopup();
  }

  signupWithAuth0() {
    this.auth0.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  }

  // Social Login Methods (Direct OAuth)
  loginWithGoogle(): Observable<any> {
    if (!environment.enableGoogleLogin) {
      return of({ success: false, message: 'Google login is disabled' });
    }

    return this.socialAuthService.loginWithGoogle().pipe(
      switchMap((socialUser: SocialUser) => {
        return this.handleSocialLogin(socialUser);
      }),
      catchError((error) => {
        console.error('Google login error:', error);
        return of({ success: false, message: 'Google login failed' });
      })
    );
  }

  loginWithFacebook(): Observable<any> {
    if (!environment.enableFacebookLogin) {
      return of({ success: false, message: 'Facebook login is disabled' });
    }

    return this.socialAuthService.loginWithFacebook().pipe(
      switchMap((socialUser: SocialUser) => {
        return this.handleSocialLogin(socialUser);
      }),
      catchError((error) => {
        console.error('Facebook login error:', error);
        return of({ success: false, message: 'Facebook login failed' });
      })
    );
  }

  private handleSocialLogin(socialUser: SocialUser): Observable<any> {
    // Convert social user to backend format
    const userData = {
      email: socialUser.email,
      name: socialUser.name,
      auth_provider: socialUser.provider,
      social_id: socialUser.id,
      avatar: socialUser.photoUrl,
      first_name: socialUser.firstName,
      last_name: socialUser.lastName
    };

    // Try to login/register with backend
    return this.apiService.socialLogin(userData).pipe(
      tap((response) => {
        if (response.success) {
          // Store tokens in both formats for compatibility
          localStorage.setItem('token', response.tokens.access);
          localStorage.setItem('accessToken', response.tokens.access);
          localStorage.setItem('refreshToken', response.tokens.refresh);
          this.updateAuthState({
            isAuthenticated: true,
            user: { ...response.user, auth_provider: 'custom' }, // Use 'custom' for social logins
            token: response.tokens.access,
            provider: 'custom'
          });
        }
      }),
      catchError((error) => {
        console.error('Social login backend error:', error);
        return of({ success: false, message: 'Failed to authenticate with server' });
      })
    );
  }

  // Custom JWT Login Methods
  loginWithCustom(email: string, password: string): Observable<any> {
    return this.apiService.login({ email, password }).pipe(
      tap((response) => {
        // Store tokens in both formats for compatibility
        localStorage.setItem('token', response.tokens.access);
        localStorage.setItem('accessToken', response.tokens.access);
        localStorage.setItem('refreshToken', response.tokens.refresh);
        this.updateAuthState({
          isAuthenticated: true,
          user: { ...response.user, auth_provider: 'custom' },
          token: response.tokens.access,
          provider: 'custom'
        });
      })
    );
  }

  registerWithCustom(userData: any): Observable<any> {
    return this.apiService.register(userData).pipe(
      tap((response) => {
        // Store tokens in both formats for compatibility
        localStorage.setItem('token', response.tokens.access);
        localStorage.setItem('accessToken', response.tokens.access);
        localStorage.setItem('refreshToken', response.tokens.refresh);
        this.updateAuthState({
          isAuthenticated: true,
          user: { ...response.user, auth_provider: 'custom' },
          token: response.tokens.access,
          provider: 'custom'
        });
      })
    );
  }

  // Universal Logout
  logout() {
    const currentState = this.authStateSubject.value;
    
    if (currentState.provider === 'auth0') {
      // Auth0 logout
      this.auth0.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    } else {
      // Custom logout - call API first, then clear local data
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Call API logout endpoint
      this.apiService.logout().subscribe({
        next: () => {
          console.log('API logout successful');
        },
        error: (error) => {
          console.error('API logout error:', error);
        },
        complete: () => {
          // Always clear local data regardless of API response
          this.clearLocalAuthData();
        }
      });
    }
  }

  private clearLocalAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      provider: null
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

  getAuthProvider(): 'auth0' | 'custom' | null {
    return this.authStateSubject.value.provider;
  }

  // Password Reset (Custom Auth only)
  resetPassword(email: string): Observable<any> {
    return this.apiService.requestPasswordReset(email);
  }

  // Change Password (Custom Auth only)
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.apiService.changePassword({
      current_password: oldPassword,
      new_password: newPassword,
      confirm_password: newPassword
    });
  }
}