import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from '../../users/service/users.service';
import { IUser } from '../../users/schema/user.schema';

interface JwtPayload {
  email: string
  id: string
  iat: number
  exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET')
    })
  }

  async validate(payload: JwtPayload): Promise<IUser> {
    const user = await this.usersService.findOneByEmail(payload.email)
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    return user
  }
}