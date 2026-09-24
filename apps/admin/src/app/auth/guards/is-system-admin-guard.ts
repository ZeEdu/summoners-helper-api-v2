import { CanActivateFn } from '@angular/router';

export const isSystemAdminGuard: CanActivateFn = (route, state) => {
  return true;
};
