import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { AuthService } from '../service/auth.service';
import { Public } from '../../decorators/public.decorator';
import { LocalGuard } from '../../guards/local.guard';
import { IUser } from '../../users/schema/user.schema';
import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { RefreshTokenGuard } from '../../guards/refresh-token.guard';
import { isProduction } from '../../utils';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1_000;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  async register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.register(body);
    this.setRefreshToken(response, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @CurrentUser() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.login(user);
    this.setRefreshToken(response, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
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
  @Get('refresh')
  async refreshToken(
    @CurrentUser() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    accessToken: string;
  }> {
    const userId = user._id.toString();
    const refreshToken = user.refreshToken;
    const tokens = await this.authService.refreshToken(userId, refreshToken);

    this.setRefreshToken(response, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
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
