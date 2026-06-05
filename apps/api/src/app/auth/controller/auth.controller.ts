import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { AuthService } from '../service/auth.service';
import { Public } from '../../decorators/public.decorator';

import { IUser } from '../../users/schema/user.schema';
import { LocalGuard } from '../../guards/local.guard';
import { CurrentUser } from '../../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @Public()
  async register(@Body() body: CreateUserDto): Promise<{ accessToken: string }> {
    return this.authService.register(body)
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@CurrentUser() user: IUser): Promise<{ accessToken: string }> {
    return this.authService.login(user)
  }
}
