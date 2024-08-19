import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateService } from './common/generate/generate.service';
import { GetFeedService } from './common/get-feed/get-feed.service';
import { RssConfigType } from './common/types';

@Injectable()
export class AppService {
  allRssConfig: RssConfigType[];
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly generateService: GenerateService,
    private readonly getFeedService: GetFeedService,
  ) {
    this.allRssConfig = this.configService.get('rssConfig');
  }

  main() {
    for (const configItem of this.allRssConfig) {
      this.generateService.generateRssItem(configItem.customName);
    }
  }
}
