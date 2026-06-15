import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';

import { UsersService } from '../../users/service/users.service';
import { IUser } from '../../users/schema/user.schema';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUser> {
    const user = await this.usersService.findOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const { password: _pass, ...result } = user;
    return result;
  }

  async login(
    user: IUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async register(
    user: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userByEmail = await this.usersService.findOneByEmail(user.email);
    if (userByEmail) {
      throw new ConflictException('Email já está sendo utilizado');
    }

    const userByUsername = await this.usersService.findOneByUsername(
      user.username,
    );
    if (userByUsername) {
      throw new ConflictException('Nome de usuário já está sendo utilizado');
    }

    const hashedPassword = await argon2.hash(user.password);
    const createdUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(
      createdUser._id.toString(),
      createdUser.email,
    );
    await this.updateRefreshToken(
      createdUser._id.toString(),
      tokens.refreshToken,
    );

    return tokens;
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Acesso negado');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Acesso negado');
    }

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
  }

  private async getTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email, jti: randomUUID() };

    const accessTokenOptions: JwtSignOptions = {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: parseInt(
        this.configService.getOrThrow<string>(
          'ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC',
        ),
      ),
    };

    const refreshTokenOptions: JwtSignOptions = {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, accessTokenOptions),
      this.jwtService.signAsync(payload, refreshTokenOptions),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshPassword = await argon2.hash(refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefreshPassword);
  }
}
