import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '../service/session.service';

export const isSystemAdminGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const user = sessionService.user();

  return !!(user && user.isSystemAdmin);
};
