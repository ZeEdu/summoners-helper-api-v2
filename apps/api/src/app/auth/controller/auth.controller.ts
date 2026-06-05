import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { AuthService } from '../service/auth.service';
import { Public } from '../../decorators/public.decorator';

import { Request } from "express";
import { UserDocument } from '../../users/schema/user.schema';
import { LocalGuard } from '../../guards/local.guard';

interface AuthenticatedRequest extends Request {
  user: UserDocument;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @Public()
  async register(@Body() body: CreateUserDto) {
    const accessToken = await this.authService.register(body)
    return { accessToken }
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: AuthenticatedRequest) {
    return this.authService.login(req.user)
  }
}
