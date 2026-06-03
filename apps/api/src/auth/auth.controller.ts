import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  // login
  @Post()
  async login() { }
  // logout

  @Post()
  async logout() { }
}
