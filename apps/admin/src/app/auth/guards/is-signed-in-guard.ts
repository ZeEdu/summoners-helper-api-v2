import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../service/session.service';

export const isSignedInGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService)
  const router = inject(Router)

  const isSigned = !!sessionService.user

  if (!isSigned) {
    router.navigate(['login'])
    return false
  }

  return true
};
