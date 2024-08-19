import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateService } from './common/generate/generate.service';
import { RssConfigType } from './common/types';

@Injectable()
export class AppService {
  allRssConfig: RssConfigType[];
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly generateService: GenerateService,
  ) {
    this.allRssConfig = this.configService.get('rssConfig');
  }
  getHello(): string {
    return 'Hello World!';
  }

  main() {
    for (const configItem of this.allRssConfig) {
      this.generateService.generateRssItem(configItem.customName);
    }
  }
}
