import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { AuthService } from '../service/auth.service';
import { Public } from '../../decorators/public.decorator';
import { LocalGuard } from '../../guards/local.guard';
import { IUser } from '../../users/schema/user.schema';
import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { RefreshTokenGuard } from '../../guards/refresh-token.guard';

const SEVEN_DAYS = 7 * 24 * 60 * 1_000;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

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
  @Get('logout')
  async logout(
    @CurrentUser() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('refresh_token', { path: '/auth/refresh' });
    await this.authService.logout(user._id.toString());
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(
    @CurrentUser() user: IUser,
    @Res({ passthrough: true }) response: Response
  ): Promise<{
    accessToken: string;
  }> {
    console.log('Entrou em refreshToken');

    const userId = user._id.toJSON();
    const refreshToken = user.refreshToken;
    const tokens = await this.authService.refreshToken(userId, refreshToken);

    this.setRefreshToken(response, tokens.refreshToken)

    return { accessToken: tokens.accessToken }
  }

  private setRefreshToken(response: Response, token: string) {
    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: false, // TODO Apenas para desenvolvimento, deve ser dinamico de acordo com o ambiente de deploy
      sameSite: 'strict',
      maxAge: SEVEN_DAYS,
      // path: '/auth/refresh',
      path: '/',
    });
  }
}
