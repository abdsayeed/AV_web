import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google: any;
    FB: any;
    gapi: any;
  }
}

export interface SocialUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  provider: 'google' | 'facebook';
}

@Injectable({
  providedIn: 'root'
})
export class SocialAuthService {
  private googleAuth: any;
  private facebookAuth: any;
  private isGoogleLoaded = false;
  private isFacebookLoaded = false;

  constructor() {
    this.loadGoogleSDK();
    this.loadFacebookSDK();
  }

  // Google OAuth Implementation
  private loadGoogleSDK(): void {
    if (typeof window === 'undefined') return;

    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogle();
    };
    document.head.appendChild(script);
  }

  private initializeGoogle(): void {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => {
        // This will be handled by the component
      }
    });

    this.isGoogleLoaded = true;
  }

  loginWithGoogle(): Observable<SocialUser> {
    return new Observable(observer => {
      if (!this.isGoogleLoaded || !window.google) {
        observer.error('Google SDK not loaded');
        return;
      }

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup
          this.googlePopupLogin().subscribe({
            next: (user) => observer.next(user),
            error: (error) => observer.error(error)
          });
        }
      });

      // Set up callback for credential response
      window.google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => {
          this.handleGoogleCredentialResponse(response).subscribe({
            next: (user) => observer.next(user),
            error: (error) => observer.error(error)
          });
        }
      });
    });
  }

  private googlePopupLogin(): Observable<SocialUser> {
    return new Observable(observer => {
      window.google.accounts.oauth2.initTokenClient({
        client_id: environment.googleClientId,
        scope: 'email profile',
        callback: (response: any) => {
          if (response.access_token) {
            this.getGoogleUserInfo(response.access_token).subscribe({
              next: (user) => observer.next(user),
              error: (error) => observer.error(error)
            });
          } else {
            observer.error('Failed to get access token');
          }
        }
      }).requestAccessToken();
    });
  }

  private handleGoogleCredentialResponse(response: any): Observable<SocialUser> {
    return new Observable(observer => {
      try {
        // Decode JWT token
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        const user: SocialUser = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          firstName: payload.given_name,
          lastName: payload.family_name,
          photoUrl: payload.picture,
          provider: 'google'
        };

        observer.next(user);
        observer.complete();
      } catch (error) {
        observer.error('Failed to parse Google credential');
      }
    });
  }

  private getGoogleUserInfo(accessToken: string): Observable<SocialUser> {
    return new Observable(observer => {
      fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => {
          const user: SocialUser = {
            id: data.id,
            email: data.email,
            name: data.name,
            firstName: data.given_name,
            lastName: data.family_name,
            photoUrl: data.picture,
            provider: 'google'
          };
          observer.next(user);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  // Facebook OAuth Implementation
  private loadFacebookSDK(): void {
    if (typeof window === 'undefined') return;

    // Load Facebook SDK
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeFacebook();
    };
    document.head.appendChild(script);
  }

  private initializeFacebook(): void {
    if (!window.FB) return;

    window.FB.init({
      appId: environment.facebookAppId,
      cookie: true,
      xfbml: true,
      version: 'v18.0'
    });

    this.isFacebookLoaded = true;
  }

  loginWithFacebook(): Observable<SocialUser> {
    return new Observable(observer => {
      if (!this.isFacebookLoaded || !window.FB) {
        observer.error('Facebook SDK not loaded');
        return;
      }

      window.FB.login((response: any) => {
        if (response.authResponse) {
          this.getFacebookUserInfo(response.authResponse.accessToken).subscribe({
            next: (user) => observer.next(user),
            error: (error) => observer.error(error)
          });
        } else {
          observer.error('Facebook login cancelled');
        }
      }, { scope: 'email,public_profile' });
    });
  }

  private getFacebookUserInfo(accessToken: string): Observable<SocialUser> {
    return new Observable(observer => {
      window.FB.api('/me', { fields: 'id,name,email,first_name,last_name,picture' }, (response: any) => {
        if (response && !response.error) {
          const user: SocialUser = {
            id: response.id,
            email: response.email,
            name: response.name,
            firstName: response.first_name,
            lastName: response.last_name,
            photoUrl: response.picture?.data?.url,
            provider: 'facebook'
          };
          observer.next(user);
          observer.complete();
        } else {
          observer.error('Failed to get Facebook user info');
        }
      });
    });
  }

  // Utility Methods
  isGoogleReady(): boolean {
    return this.isGoogleLoaded && !!window.google;
  }

  isFacebookReady(): boolean {
    return this.isFacebookLoaded && !!window.FB;
  }

  // Logout methods
  logoutGoogle(): Observable<void> {
    return new Observable(observer => {
      if (window.google && window.google.accounts.id) {
        window.google.accounts.id.disableAutoSelect();
      }
      observer.next();
      observer.complete();
    });
  }

  logoutFacebook(): Observable<void> {
    return new Observable(observer => {
      if (window.FB) {
        window.FB.logout(() => {
          observer.next();
          observer.complete();
        });
      } else {
        observer.next();
        observer.complete();
      }
    });
  }
}