import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeepModeService } from '../keep-mode/keep-mode.service';
import { ArticleService } from '../prisma/article.service';
import { RssParserService } from '../rss-parser/rss-parser.service';
import { RssConfigType } from '../types';
import { DateTimeService } from '../utils/date-time.service';

@Injectable()
export class GenerateService {
  allRssConfig: RssConfigType[];

  constructor(
    private readonly logger: Logger,
    private readonly articleService: ArticleService,
    private readonly configService: ConfigService,
    private rssParserService: RssParserService,
    private readonly dateTimeService: DateTimeService,
    private readonly keepModeService: KeepModeService,
  ) {
    this.allRssConfig = this.configService.get('rssConfig');
  }

  // 获取周期内的rss items
  private getItemsInPeriod(items: any[], updateInterval: number) {
    return items.filter((item) => {
      const { pubDate } = item;
      return this.dateTimeService.checkDateInPeriod(pubDate, updateInterval);
    });
  }
  async generateRssItem(customName: string) {
    const rssConfig = this.allRssConfig.find(
      (item) => item.customName === customName,
    );
    const { sourceUrl, updateInterval, mode, customTitle, tagName } = rssConfig;

    const { items, feedInfo } = await this.rssParserService.parseUrl(sourceUrl);
    const period = this.dateTimeService.getPeriodInfoForDateString(
      items[0].pubDate,
      updateInterval,
    );
    const { periodIndex } = period;
    const periodIndexData =
      await this.articleService.findByCustomNameAndPeriodIndex(
        customName,
        periodIndex,
      );
    if (!periodIndexData) {
      if (mode === 'keep') {
        await this.keepModeService.generateRssItem(
          this.getItemsInPeriod(items, updateInterval),
          periodIndex,
          customName,
          tagName,
          sourceUrl,
        );
      }
    }
  }
}
