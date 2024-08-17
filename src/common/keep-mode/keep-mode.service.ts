import { Injectable, Logger } from '@nestjs/common';
import { ArticleService } from '../prisma/article.service';
import { KeepModeItemtype, PeriodInfoType } from '../types';

@Injectable()
export class KeepModeService {
  constructor(
    private readonly logger: Logger,
    private readonly articleService: ArticleService,
  ) {}

  async generateFeed(
    prtiodItems: KeepModeItemtype[],
    tagName: string,
    title: string,
    period: PeriodInfoType,
  ): Promise<string> {
    const { periodIndex } = period;
    const periodIndexData =
      await this.articleService.findByPeriodIndex(periodIndex);
    if (periodIndexData) {
      return `<?xml version="1.0" encoding="UTF-8"?>
      <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
        <channel>
          <title>${title}</title>
          <description>RSS 汇总</description>
          ${periodIndexData.rssContent}
        </channel>
      </rss>`;
    } else {
      await this.generateRssItem(prtiodItems, periodIndex, title, tagName);
      return 'hello world';
    }
  }

  private async generateRssItem(
    prtiodItems: KeepModeItemtype[],
    periodIndex: number,
    title: string,
    tagName: string,
  ) {
    // 合并所有 prtiodItems 的内容
    const combinedContent = prtiodItems
      .map(
        (item) => `
        <div>
          <div>文章标题：${item.title}</div>
          <div>发布日期：${item.pubDate || '未知发布日期'}</div>
          ${item[tagName as keyof KeepModeItemtype] || ''}
          <div style="text-align: center; margin: 50px 0 0; color: #888;">
            <strong>August 11, 2024</strong>
          </div>
        </div>
      `,
      )
      .join('');

    // 将内容包裹在 CDATA 中
    const cdataWrappedContent = `<![CDATA[${combinedContent}]]>`;
    // 生成 rssContent
    const rssContent = `
      <item>
        <title>${title} 第${periodIndex}期</title>
        <description>${cdataWrappedContent}</description>
      </item>
    `;
    await this.articleService.createArticle({
      periodIndex,
      rssContent,
    });
  }
}
