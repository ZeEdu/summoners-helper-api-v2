import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenStorageService } from '../auth/service/auth-token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`authInterceptor`);

  const authTokenStorageService = inject(AuthTokenStorageService)
  const { accessToken } = authTokenStorageService.get()

  if (accessToken) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + accessToken)
    })

    return next(clonedReq)
  }
  return next(req);

};
