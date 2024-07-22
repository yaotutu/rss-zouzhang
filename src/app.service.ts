import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { RssParserService } from './common/rss-parser/rss-parser.service';
import { RssConfigType } from './common/types';

@Injectable()
export class AppService {
  constructor(private rssParserService: RssParserService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getRssConfig() {
    const configPath = path.join(__dirname, '..', 'rss-config.json');
    const rawData = await fs.readFile(configPath, 'utf8');
    console.log('rawData', rawData);
    return JSON.parse(rawData) as RssConfigType[];
  }

  async main() {
    const rssConfig = await this.getRssConfig();

    for (const configItem of rssConfig) {
      const { sourceUrl, tagName } = configItem;
      const { items } = await this.rssParserService.parseUrl(sourceUrl);
      console.log('res', items);
    }
  }
}
