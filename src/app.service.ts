import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import { GenerateService } from './common/generate/generate.service';
import { RssParserService } from './common/rss-parser/rss-parser.service';
import { RssConfigType } from './common/types';

@Injectable()
export class AppService {
  allRssConfig: RssConfigType[];
  constructor(
    private rssParserService: RssParserService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly generateService: GenerateService,
  ) {
    this.allRssConfig = this.configService.get('rssConfig');
  }
  getHello(): string {
    return 'Hello World!';
  }
  async getRssConfig() {
    const configPath = path.join(__dirname, '..', 'rss-config.json');
    const rawData = await fs.readFile(configPath, 'utf8');
    return JSON.parse(rawData) as RssConfigType[];
  }

  main() {
    for (const configItem of this.allRssConfig) {
      this.generateService.generateRssItem(configItem.customName);
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
  // async getFeed(rssName: string) {
  //   const rssConfig = this.configService.get<RssConfigType[]>('rssConfig');
  //   const itemConfig = rssConfig.find((item) => item.tagName === rssName);
  //   const { sourceUrl, updateInterval, mode, customTitle, tagName } =
  //     itemConfig;
  //   const { items, feedInfo } = await this.rssParserService.parseUrl(sourceUrl);

  //   return rssName;
  // }
}
