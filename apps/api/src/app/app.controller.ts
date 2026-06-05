import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import { Request } from "express";

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getApi(@Req() req: Request) {
    console.log({ req });
    return this.appService.getApi();
  }
}
