import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { IUserWithPuuid } from '../../users/schema/user.schema';

@Injectable()
export class HasRiotInfoGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as IUserWithPuuid;

    return !!(user?.puuid && user?.gameName && user?.tagLine && user?.server);
  }
}
