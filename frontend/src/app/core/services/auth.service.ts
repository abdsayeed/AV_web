import { Injectable, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

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
    const customToken = localStorage.getItem('token');
    
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

  // Social Login Methods
  loginWithGoogle() {
    this.auth0.loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2'
      }
    });
  }

  loginWithFacebook() {
    this.auth0.loginWithRedirect({
      authorizationParams: {
        connection: 'facebook'
      }
    });
  }

  // Custom JWT Login Methods
  loginWithCustom(email: string, password: string): Observable<any> {
    return this.apiService.login({ email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.tokens.access);
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
        localStorage.setItem('token', response.tokens.access);
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
      // Custom logout
      localStorage.removeItem('token');
      this.updateAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        provider: null
      });
      this.router.navigate(['/']);
    }
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