import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthTokenStorageService } from '../../auth/service/auth-token-storage.service';
import { AuthService } from '../../auth/service/auth.service';
import { EventBusService } from '../../services/event-bus.service';
import { EventData } from '../../services/event.class';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const eventBusService = inject(EventBusService)
  const authTokenStorageService = inject(AuthTokenStorageService)

  const services = {
    authService,
    eventBusService,
    authTokenStorageService
  }

  return next(req).pipe(
    catchError((err) => {
      const isRefreshURL = req.url.includes('web/refresh')
      const isLogoutURL = req.url.includes('logout')
      const skipURLs = !(isRefreshURL || isLogoutURL)
      const isHttpErrorResponse = err instanceof HttpErrorResponse
      const is401Status = err.status === 401
      const hasAuthorizationHeaders = req.headers.has('Authorization')

      if (
        isHttpErrorResponse &&
        is401Status &&
        hasAuthorizationHeaders &&
        skipURLs
      ) {
        return handleUnauthorizedError(req, next, err, services)
      }

      return throwError(() => err);
    }),
  );
};

function handleUnauthorizedError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  error: HttpErrorResponse,
  services: {
    authService: AuthService,
    eventBusService: EventBusService,
    authTokenStorageService: AuthTokenStorageService
  }
) {
  const currentToken = services.authTokenStorageService.get()
  const requestToken = req.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!requestToken) {
    return throwError(() => error)
  }

  if (currentToken.accessToken && (requestToken !== currentToken.accessToken)) {
    return retryWithToken(req, next, currentToken.accessToken, services.eventBusService)
  }

  return services.authService
    .refreshToken()
    .pipe(
      catchError(error => {
        const isHttpErrorResponse = error instanceof HttpErrorResponse
        if (isHttpErrorResponse &&
          [401, 403].includes(error.status)
        ) {
          services.eventBusService.emit(new EventData('logout', null))
        }
        return throwError(() => error)
      }),
      switchMap(({ accessToken }) => retryWithToken(req, next, accessToken, services.eventBusService)),
    )
}

function retryWithToken(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  token: string,
  eventBusService: EventBusService
) {
  const clone = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + token)
  })

  return next(clone)
    .pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          eventBusService.emit(new EventData('logout', null))
        }

        return throwError(() => error)
      }))
}
