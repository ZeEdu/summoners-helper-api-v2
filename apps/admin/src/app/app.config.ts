import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';

import { appRoutes } from './app.routes';
import { AuthTokenStorageService } from './auth/service/auth-token-storage.service';
import { AuthService } from './auth/service/auth.service';
import { SessionService } from './auth/service/session.service';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      const authTokenStorageService = inject(AuthTokenStorageService)

      const { accessToken } = authTokenStorageService.get()
      console.log(`provideAppInitializer`, accessToken);

      if (accessToken) {
        const authService = inject(AuthService)
        const sessionService = inject(SessionService)
        return authService.refreshToken()
          .pipe(
            switchMap(() => authService.getMe()
              .pipe(tap((user) => {
                sessionService.setUser(user)
              }))
            ))
      }

      return of(null)
    })
  ],
};
