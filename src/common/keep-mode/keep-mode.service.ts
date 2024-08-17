import { Injectable, Logger } from '@nestjs/common';
import { KeepModeItemtype, PeriodInfoType } from '../types';

@Injectable()
export class KeepModeService {
  constructor(private readonly logger: Logger) {}
  generateFeed(
    items: KeepModeItemtype[],
    tagName: string,
    title: string,
    period: PeriodInfoType,
  ): string {
    const { periodIndex } = period;
    const rssItems = items
      .map((item) => this.generateRssItem(item, periodIndex, tagName))
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>${title}</title>
          <description>RSS 汇总</description>
          ${rssItems}
        </channel>
      </rss>`;
  }
  generateRssItem(
    item: KeepModeItemtype,
    periodIndex: number,
    tagName: string,
  ): string {
    const content = item[tagName as keyof KeepModeItemtype] as string;

    return `
      <item>
        <title>${item.title} 第${periodIndex}期</title>
        <description><![CDATA[
          <div>
            <div>文章标题：${item.title}</div>
            <div>发布日期：08月08日</div>
            ${content}
            <div style="text-align: center; margin: 50px 0 0; color: #888;">
              <strong>August 11, 2024</strong>
            </div>
          </div>
        ]]></description>
      </item>
    `;
  }
}
