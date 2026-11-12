
import { faker } from '@faker-js/faker';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { UserDto } from '@org/contracts';

import { Types } from 'mongoose';
import { AuthService } from '../../auth/service/auth.service';
import { IsAdminGuard } from './is-admin.guard';

describe('IsAdminGuard', () => {
  let guard: IsAdminGuard;
  let authService: jest.Mocked<AuthService>;

  const user: UserDto = {
    id: new Types.ObjectId().toString(),
    email: faker.internet.email(),
    username: faker.internet.userName()
  }
  const context = {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext;

  beforeEach(() => {
    authService = {
      validateSystemAdmin: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    guard = new IsAdminGuard(authService);
  });

  it('should allow systemAdmin', async () => {
    authService.validateSystemAdmin.mockResolvedValue(user);

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(authService.validateSystemAdmin).toHaveBeenCalledWith(user.email);
  })

  it('should deny non SystemAdmin', async () => {
    authService.validateSystemAdmin.mockRejectedValue(new UnauthorizedException('Not System Admin'));

    await expect(guard.canActivate(context)).rejects.toThrow('Not System Admin');

    expect(authService.validateSystemAdmin).toHaveBeenCalledWith(user.email);
  })

  it('should propagate service errors', async () => {
    authService.validateSystemAdmin.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Database error',
    );
  });
});
