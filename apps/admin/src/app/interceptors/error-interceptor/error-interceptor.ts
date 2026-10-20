import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { SessionService } from '../../auth/service/session.service';
import { EventBusService } from '../../services/event-bus.service';
import { EventData } from '../../services/event.class';
import { IsRefreshingService } from './is-refreshing.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const sessionService = inject(SessionService);
  const isRefreshingService = inject(IsRefreshingService)
  const eventBusService = inject(EventBusService)

  const services = {
    authService,
    sessionService,
    isRefreshingService,
    eventBusService,
  }

  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && !req.url.includes('signin') && err.status === 401) {
        return handleUnauthorizedError(req, next, services)
      }

      return throwError(() => err);
    }),
  );
};

function handleUnauthorizedError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  services: {
    authService: AuthService,
    sessionService: SessionService,
    isRefreshingService: IsRefreshingService,
    eventBusService: EventBusService
  }
) {
  if (!services.isRefreshingService.isRefreshing()) {
    services.isRefreshingService.update(true)

    if (services.sessionService.user()) {
      return services.authService.refreshToken().pipe(
        switchMap(() => {
          services.isRefreshingService.update(false)

          return next(req)
        }),
        catchError(error => {
          services.isRefreshingService.update(false)

          if (error.status === 403) {
            services.eventBusService.emit(new EventData('logout', null))
          }

          return throwError(() => error)
        })
      )
    }
  }

  return next(req)
}