import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/service/users.service';
import { IUserWithPuuid } from '../../users/schema/user.schema';
import { I18nService } from 'nestjs-i18n';

interface JwtPayload {
  email: string;
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService,
    private i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<IUserWithPuuid> {
    const user = await this.usersService.findOneByEmailWithPuuid(payload.email);
    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('passport-strategy.errors.validate.userNotFound'),
      );
    }

    return user;
  }
}
