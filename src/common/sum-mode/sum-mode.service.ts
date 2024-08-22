import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArticleService } from '../prisma/article.service';
import { KeepModeItemtype, RssConfigType } from '../types';
import { DateTimeService } from '../utils/date-time.service';

@Injectable()
export class SumModeService {
  allRssConfig: RssConfigType[];
  constructor(
    private readonly logger: Logger,
    private readonly articleService: ArticleService,
    private readonly configService: ConfigService,
    private readonly dateTimeService: DateTimeService,
  ) {
    this.allRssConfig = this.configService.get('rssConfig');
  }
  async generateRssItem(
    prtiodItems: KeepModeItemtype[],
    periodIndex: number,
    customName: string,
    tagName: string,
    sourceUrl: string,
  ) {}
}
