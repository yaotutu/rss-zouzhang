import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { KeepModeService } from './common/keep-mode/keep-mode.service';
import { SummarizeService } from './common/langchainjs/summarize.setvice';
import { RssParserService } from './common/rss-parser/rss-parser.service';
import { RssConfigType } from './common/types';
import { DateTimeService } from './common/utils/date-time.service';

@Injectable()
export class AppService {
  constructor(
    private rssParserService: RssParserService,
    private readonly logger: Logger,
    private readonly summarizeService: SummarizeService,
    private readonly dateTimeService: DateTimeService,
    private readonly keepModeService: KeepModeService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getRssConfig() {
    const configPath = path.join(__dirname, '..', 'rss-config.json');
    const rawData = await fs.readFile(configPath, 'utf8');
    return JSON.parse(rawData) as RssConfigType[];
  }

  getItemsInPeriod(items: any[], updateInterval: number) {
    return items.filter((item) => {
      const { pubDate } = item;
      return this.dateTimeService.checkDateInPeriod(pubDate, updateInterval);
    });
  }

  async main() {
    const rssConfig = await this.getRssConfig();

    for (const configItem of rssConfig) {
      const { sourceUrl, tagName, updateInterval, mode, customTitle } =
        configItem;

      const { items, feedInfo } =
        await this.rssParserService.parseUrl(sourceUrl);
      const prtiodItems = this.getItemsInPeriod(items, updateInterval);
      const period = this.dateTimeService.getPeriodInfoForDateString(
        items[0].pubDate,
        updateInterval,
      );

      if (mode === 'keep') {
        return this.keepModeService.generateFeed(
          prtiodItems,
          tagName,
          customTitle,
          period,
        );
      }

      // const plainTextContent = convert(targetContent, {
      //   format: 'plain',
      //   wordwrap: 120,
      //   selectors: [
      //     { selector: 'a', options: { ignoreHref: true } },
      //     { selector: 'img', format: 'skip' },
      //   ],
      // }).replace(/\s+/g, ' ');
      // const res = await this.summarizeService.summarize(plainTextContent);
      // this.logger.verbose('res', res);
    }
  }
}
