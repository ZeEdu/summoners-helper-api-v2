import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { AuthService } from '../auth/service/auth.service';
import { AuthenticatedRequest } from "../types";

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('IsAdminGuard -> canActivate');

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { user } = request

    return this.authService.validateSystemAdmin(user.email)
      .then(user => {
        console.log('authService->validateSystemAdmin');
        return !!user
      })
  }
} 