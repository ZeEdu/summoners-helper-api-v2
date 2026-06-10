import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/service/users.service';
import { IUser } from '../../users/schema/user.schema';

type RefreshTokenPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          (req.cookies as Record<string, string>)?.refresh_token ?? null,
      ]),
      secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: RefreshTokenPayload): Promise<IUser> {
    const refreshToken = (req.cookies as Record<string, string>)?.refresh_token;
    if (!refreshToken) {
      throw new ForbiddenException();
    }

    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Substitui o token hasheado pelo raw que vem no cookie
    return { ...user, refreshToken };
  }
}
