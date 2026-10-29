import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthenticatedRequest } from '../../types';

@Injectable()
export class HasRiotInfoGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user

    return !!(user?.puuid && user?.gameName && user?.tagLine && user?.server);
  }
}
