import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth header if we have a token and the request is to our API
    if (this.isApiRequest(req.url)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        req = this.addTokenHeader(req, token);
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 errors (token expired)
        if (error.status === 401 && this.isApiRequest(req.url)) {
          return this.handle401Error(req, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  private isApiRequest(url: string): boolean {
    return url.startsWith(environment.apiUrl);
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        return this.refreshToken(refreshToken).pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            
            if (response && response.access) {
              localStorage.setItem('accessToken', response.access);
              this.refreshTokenSubject.next(response.access);
              return next.handle(this.addTokenHeader(request, response.access));
            }
            
            // Refresh failed, logout user
            this.logout();
            return throwError(() => new Error('Token refresh failed'));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.logout();
            return throwError(() => error);
          })
        );
      } else {
        // No refresh token, logout user
        this.logout();
        return throwError(() => new Error('No refresh token available'));
      }
    }

    // If we're already refreshing, wait for the new token
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private refreshToken(refreshToken: string): Observable<any> {
    // Make a request to refresh the token
    const refreshRequest = new HttpRequest('POST', `${environment.apiUrl}/auth/token/refresh/`, {
      refresh: refreshToken
    });

    return new Observable(observer => {
      fetch(`${environment.apiUrl}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken })
      })
      .then(response => response.json())
      .then(data => {
        observer.next(data);
        observer.complete();
      })
      .catch(error => {
        observer.error(error);
      });
    });
  }

  private logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}