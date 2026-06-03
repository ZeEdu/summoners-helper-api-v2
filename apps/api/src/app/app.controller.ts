import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '../decorators/public.decorator';

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getData(@Request() req) {
    return this.appService.getData();
  }
}
