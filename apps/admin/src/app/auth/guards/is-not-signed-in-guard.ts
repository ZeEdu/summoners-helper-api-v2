import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../service/session.service';

export const isNotSignedInGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService)
  const router = inject(Router)

  const isNotSignedIn = sessionService.user === undefined

  if (!isNotSignedIn) {
    router.navigate([''])
  }

  return isNotSignedIn
};
