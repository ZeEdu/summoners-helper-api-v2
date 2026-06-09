import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express'

type RefreshTokenInputPayload = {
  sub: string,
  email: string,
  iat: number,
  exp: number
}

type RefreshTokenOutputPayload = RefreshTokenInputPayload & { refreshToken: string }

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true
    })
  }

  validate(req: Request, payload: RefreshTokenInputPayload): RefreshTokenOutputPayload {
    const refreshToken = (req.cookies as Record<string, string>)?.refresh_token;
    if (!refreshToken) {
      throw new ForbiddenException();
    }
    return { ...payload, refreshToken };
  }
}