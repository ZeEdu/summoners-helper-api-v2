import { Body, Controller, Post, Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  // async register(@Body() body: CreateUserDto) {
  async register(@Body() body: any) {
    console.log('Entrou aqui');
    return { register: true }
    // return this.authService.register(body)
  }

  // @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return { login: true }
    // return this.authService.login(req.user)
  }


}
