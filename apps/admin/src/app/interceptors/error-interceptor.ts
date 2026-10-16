import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { SessionService } from '../auth/service/session.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      const hasUserSession = !!sessionService.user();

      if ([401, 403].includes(err.status) && hasUserSession) {
        router.navigate(['login']);
        authService
          .logout()
          .pipe(catchError(() => of(null)))
          .subscribe();
      }

      return throwError(() => err);
    }),
  );
};
