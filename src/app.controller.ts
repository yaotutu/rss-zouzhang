import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  runMain() {
    return this.appService.main();
  }

  @Get(':customName')
  getFeed(@Param('customName') customName: string) {
    // return this.appService.getFeed(customName);
  }
}
