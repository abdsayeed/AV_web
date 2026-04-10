import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authState$.pipe(
    take(1),
    map(s => {
      if (s.isAuthenticated) return true;
      localStorage.setItem('redirectUrl', state.url);
      return router.createUrlTree(['/login']);
    }),
  );
};

export const GuestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authState$.pipe(
    take(1),
    map(s => s.isAuthenticated ? router.createUrlTree(['/dashboard']) : true),
  );
};

export const AdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authState$.pipe(
    take(1),
    map(s => {
      if (s.isAuthenticated && s.user?.role === 'admin') return true;
      return router.createUrlTree(['/']);
    }),
  );
};
