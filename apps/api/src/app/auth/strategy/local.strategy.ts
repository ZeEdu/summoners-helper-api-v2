import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../service/auth.service";
import { IUser } from "../../users/schema/user.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: string, password: string): Promise<Omit<IUser, 'password'>> {
    console.log('validate');

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      console.log('UnauthorizedException');
      throw new UnauthorizedException();
    }

    return user;
  }
}