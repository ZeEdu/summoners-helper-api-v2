import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { SessionService } from '../auth/service/session.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`errorInterceptor`);

  const router = inject(Router)
  const sessionService = inject(SessionService)
  const authService = inject(AuthService)

  return next(req).pipe(catchError((err) => {
    if ([401, 403].includes(err.status) && !!sessionService.user) {
      router.navigate(['login'])
      authService.logout().pipe(catchError((err) => {
        console.log(`errorInterceptor -> authService.logout`);
        return of(null)
      }))
        .subscribe() // TODO: deve ter uma maneira melhor de fazer isso
      // force logout
    }

    const error = (err && err.error && err.error.message) || err.statusText;
    console.error(err);
    return throwError(() => error);
  }));
};
