import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeepModeService } from '../keep-mode/keep-mode.service';
import { RssConfigType } from '../types';

@Injectable()
export class GetFeedService {
  allRssConfig: RssConfigType[];

  constructor(
    private readonly configService: ConfigService,
    private readonly keepModeService: KeepModeService,
    private readonly logger: Logger,
  ) {
    this.allRssConfig = this.configService.get('rssConfig');
  }
  main(customName: string) {
    const rssCongfig = this.allRssConfig.find(
      (item) => item.customName === customName,
    );
    if (!rssCongfig) {
      this.logger.log('customName not found', 'GetFeedService');
      return 'customName not found';
    }
    const { mode } = rssCongfig;
    if (mode === 'keep') {
      return this.keepModeService.generateFeed(customName);
    }
  }
}
