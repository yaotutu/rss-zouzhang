import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { GetFeedService } from './common/get-feed/get-feed.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly getFeed: GetFeedService,
  ) {}

  @Get()
  executeMain() {
    return this.appService.main();
  }

  @Get('favicon.ico')
  // TODO 添加 favicon.ico
  handleFavicon() {
    // 可以返回一个空响应，或者你可以提供一个实际的favicon.ico文件
    return;
  }

  @Get(':customName')
  getFeedByName(@Param('customName') customName: string) {
    return this.getFeed.main(customName);
  }
}
