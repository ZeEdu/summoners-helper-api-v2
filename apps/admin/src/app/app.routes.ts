import { Route } from '@angular/router';

import { isNotSignedInGuard } from './auth/guards/is-not-signed-in-guard';
import { isSignedInGuard } from './auth/guards/is-signed-in-guard';
import { Login } from './auth/login/login';
import { Home } from './home/home';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
    canActivate: [isSignedInGuard]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [isNotSignedInGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];
