import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApi(): { message: string } {
    return { message: 'Hello API' };
  }
}
