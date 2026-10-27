import { Route } from '@angular/router';

import { isNotSignedInGuard } from './auth/guards/is-not-signed-in-guard';
import { isSignedInGuard } from './auth/guards/is-signed-in-guard';
import { isSystemAdminGuard } from './auth/guards/is-system-admin-guard';
import { Login } from './auth/login/login';
import { CommentReport } from './comment-report/comment-report';
import { GuideReport } from './guide-report/guide-report';
import { Home } from './home/home';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
    canActivate: [isSignedInGuard, isSystemAdminGuard]
  },
  {
    path: 'guide',
    component: GuideReport,
    canActivate: [isSignedInGuard, isSystemAdminGuard]
  },
  {
    path: 'comment',
    component: CommentReport,
    canActivate: [isSignedInGuard, isSystemAdminGuard]
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
  },
  // {
  //   path: '**',
  //   component: NotFound
  // },
];
