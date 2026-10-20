import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { catchError, EMPTY, of, switchMap, tap } from 'rxjs';

import { appRoutes } from './app.routes';
import { AuthTokenStorageService } from './auth/service/auth-token-storage.service';
import { AuthService } from './auth/service/auth.service';
import { SessionService } from './auth/service/session.service';
import { DataDragonService } from './data-dragon/data-dragon.service';
import { authInterceptor } from './interceptors/auth-interceptor/auth-interceptor';
import { errorInterceptor } from './interceptors/error-interceptor/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAppInitializer(() => {
      const authTokenStorageService = inject(AuthTokenStorageService);

      const { accessToken } = authTokenStorageService.get();

      if (accessToken) {
        const authService = inject(AuthService);
        const sessionService = inject(SessionService);
        return authService.refreshToken().pipe(
          catchError(() => {
            authTokenStorageService.delete();
            sessionService.removeUser();
            return of(null);
          }),
          switchMap((user) => {
            if (user) {
              return authService.getMe().pipe(
                catchError(() => {
                  authTokenStorageService.delete();
                  sessionService.removeUser();

                  return of(null);
                }),
                tap((user) => {
                  if (user) {
                    sessionService.setUser(user);
                  }
                }),
              );
            }
            return EMPTY;
          }),
        );
      }

      return of(null);
    }),
    provideAppInitializer(() => inject(DataDragonService).load()),
  ],
};
