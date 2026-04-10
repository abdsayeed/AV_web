import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();
  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/auth/token/refresh/')) {
        return handle401(req, next, auth);
      }
      return throwError(() => err);
    }),
  );
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  auth: AuthService,
): Observable<HttpEvent<unknown>> {
  if (isRefreshing) {
    return refreshSubject.pipe(
      filter(t => t !== null),
      take(1),
      switchMap(t => next(addToken(req, t!))),
    );
  }
  isRefreshing = true;
  refreshSubject.next(null);
  return auth.refreshToken().pipe(
    switchMap(newToken => {
      isRefreshing = false;
      refreshSubject.next(newToken);
      return next(addToken(req, newToken));
    }),
    catchError(err => {
      isRefreshing = false;
      auth.logout();
      return throwError(() => err);
    }),
  );
}
