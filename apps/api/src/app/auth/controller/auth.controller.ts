import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from '../service/auth.service';
import { Public } from '../../decorators/public.decorator';
import { LocalGuard } from '../../guards/local.guard';
import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { RefreshTokenGuard } from '../../guards/refresh-token.guard';
import { isProduction } from '../../utils';
import { CreateUserDto, IUser } from '@org/contracts';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1_000;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('web/register')
  @Public()
  async webRegister(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.register(body);
    this.setRefreshToken(response, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Post('mobile/register')
  @Public()
  async mobileRegister(
    @Body() body: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.authService.register(body);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @Post('web/login')
  @UseGuards(LocalGuard)
  async webLogin(
    @CurrentUser() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.login(user);
    this.setRefreshToken(response, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Post('mobile/login')
  @UseGuards(LocalGuard)
  async mobileLogin(
    @CurrentUser() user: IUser
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.login(user);
    return { ...tokens };
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('refresh_token', {
      path: isProduction ? '/auth/refresh' : '/',
    });
    await this.authService.logout(user._id.toString());
  }

  @UseGuards(RefreshTokenGuard)
  @Post('web/refresh')
  async webRefreshToken(
    @CurrentUser() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    accessToken: string;
  }> {
    const userId = user._id.toString();
    const refreshToken = user.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Token necessário não informado')
    }
    const tokens = await this.authService.refreshToken(userId, refreshToken);

    this.setRefreshToken(response, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('mobile/refresh')
  async mobileRefreshToken(
    @CurrentUser() user: IUser
  ): Promise<{
    accessToken: string;
  }> {
    const userId = user._id.toString();
    const refreshToken = user.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Token necessário não informado')
    }

    const tokens = await this.authService.refreshToken(userId, refreshToken);
    return { ...tokens };
  }

  private setRefreshToken(response: Response, token: string) {
    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: SEVEN_DAYS,
      path: isProduction ? '/auth/refresh' : '/',
    });
  }
}
