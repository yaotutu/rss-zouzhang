import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArticleService } from '../prisma/article.service';
import { KeepModeItemtype, RssConfigType } from '../types';
import { DateTimeService } from '../utils/date-time.service';

@Injectable()
export class KeepModeService {
  allRssConfig: RssConfigType[];
  constructor(
    private readonly logger: Logger,
    private readonly articleService: ArticleService,
    private readonly configService: ConfigService,
    private readonly dateTimeService: DateTimeService,
  ) {
    this.allRssConfig = this.configService.get('rssConfig');
  }

  async generateFeed(customName: string): Promise<string> {
    const rssItemContent = await this.getRssContentByCustomName(customName);
    const rssContentXML = rssItemContent
      .map((item) => item.rssContent)
      .join('');
    // TODO 增加link标签
    return `<?xml version="1.0" encoding="UTF-8"?>
      <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
        <channel>
          <title>${customName}</title>
          <description>RSS 汇总</description>
          ${rssContentXML}
        </channel>
      </rss>`;
  }

  async generateRssItem(
    prtiodItems: KeepModeItemtype[],
    periodIndex: number,
    customName: string,
  ) {
    const { tagName, sourceUrl, dateTag, updateInterval } =
      this.allRssConfig.find((item) => item.customName === customName);
    const periodInfo =
      this.dateTimeService.getCurrentPeriodInfo(updateInterval);
    const { startTimestamp, endTimestamp } = periodInfo;
    // 合并所有 prtiodItems 的内容
    const combinedContent = prtiodItems
      .map((item) => {
        const itemDate = item[dateTag];
        const dateString = this.dateTimeService.formatDateToString(itemDate);
        return `
        <p>
          <div style="text-align: center; margin: 50px 0 0; color: #888;">
            <strong>${dateString}</strong>
          </div>
          <h2><a href="${item.link}" rel="nofollow noopener" target="_blank">${item.title}</a></h2>
          <strong>原文链接:</strong> <a href="${item.link}">查看原文</a> <br />
          <strong>发布日期:</strong> ${dateString || '未知发布日期'} <br />
          ${item[tagName as keyof KeepModeItemtype] || ''}
        </p>
        <hr />
      `;
      })
      .join('');

    // 将内容包裹在 CDATA 中
    const cdataWrappedContent = `<![CDATA[${combinedContent}]]>`;
    // 生成 rssContent
    const rssContent = `
      <item>
        <title> 第${periodIndex}期</title>
        <pubDate>${new Date(endTimestamp).toUTCString()}</pubDate>
        <description>${cdataWrappedContent}</description>
      </item>
    `;
    await this.articleService.createArticle({
      periodIndex,
      rssContent,
      customName,
      sourceUrl,
    });
    this.logger.verbose(
      `生成 ${customName} 第${periodIndex}期`,
      'KeepModeService',
    );
  }

  // 根据 customName 获取 rssContent
  async getRssContentByCustomName(customName: string) {
    const rssContent = (
      await this.articleService.findByCustomName(customName)
    ).slice(0, 10);
    return rssContent;
  }
}
