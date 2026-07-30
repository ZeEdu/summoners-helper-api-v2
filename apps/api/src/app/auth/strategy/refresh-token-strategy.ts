import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { IUser } from '@org/contracts';

import { UsersService } from '../../users/service/users.service';

type RefreshTokenPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

function fromCookie(req: Request) {
  return (req.cookies as Record<string, string>)?.refresh_token ?? null
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        fromCookie,
        ExtractJwt.fromBodyField('refreshToken')
      ]),
      secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }


  getFromCookies(req: Request) {
    return (req.cookies as Record<string, string>)?.refresh_token
  }

  getFromBody(req: Request) {
    return (req.body as Record<string, string>)?.refreshToken
  }

  async validate(req: Request, payload: RefreshTokenPayload): Promise<IUser> {
    const refreshToken = this.getFromCookies(req) || this.getFromBody(req);

    if (!refreshToken) {
      throw new ForbiddenException();
    }

    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('passport-strategy.errors.validate.userNotFound'),
      );
    }

    return { ...user, refreshToken };
  }
}
