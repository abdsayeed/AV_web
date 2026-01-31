import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.apiService.currentUser$.pipe(
      take(1),
      map(user => {
        const isAuthenticated = !!user && this.apiService.isAuthenticated();
        
        if (!isAuthenticated) {
          // Store the attempted URL for redirecting after login
          localStorage.setItem('redirectUrl', state.url);
          this.router.navigate(['/login']);
          return false;
        }
        
        return true;
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.apiService.currentUser$.pipe(
      take(1),
      map(user => {
        const isAuthenticated = !!user && this.apiService.isAuthenticated();
        const isAdmin = user?.role === 'admin';
        
        if (!isAuthenticated) {
          localStorage.setItem('redirectUrl', state.url);
          this.router.navigate(['/login']);
          return false;
        }
        
        if (!isAdmin) {
          this.router.navigate(['/']);
          return false;
        }
        
        return true;
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.apiService.currentUser$.pipe(
      take(1),
      map(user => {
        const isAuthenticated = !!user && this.apiService.isAuthenticated();
        
        if (isAuthenticated) {
          // User is already logged in, redirect to home
          this.router.navigate(['/']);
          return false;
        }
        
        return true;
      })
    );
  }
}