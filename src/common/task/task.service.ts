import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GenerateService } from '../generate/generate.service';
import { RssConfigType } from '../types';

@Injectable()
export class TaskService {
  allRssConfig: RssConfigType[];

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly generateService: GenerateService,
  ) {
    this.allRssConfig = this.configService.get('rssConfig');
  }
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    for (const configItem of this.allRssConfig) {
      this.generateService.generateRssItem(configItem.customName);
    }
    this.logger.verbose('corn 任务执行了', 'CORN');
  }
}
