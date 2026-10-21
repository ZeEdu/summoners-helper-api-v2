import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../service/session.service';

export const isSystemAdminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const sessionService = inject(SessionService);
  const user = sessionService.user();

  if (user && user.isSystemAdmin) {
    return true
  }

  return router.createUrlTree(['login']);
};
