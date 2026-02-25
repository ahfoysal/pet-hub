import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to Petzy API',
      status: 'OK',
      version: '1.0.0',
      docs: `https://richardhan-server.fly.dev/api/docs`,
    };
  }
}
