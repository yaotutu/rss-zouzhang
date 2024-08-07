import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { convert } from 'html-to-text';
import * as path from 'path';
import { RssParserService } from './common/rss-parser/rss-parser.service';
import { RssConfigType } from './common/types';

@Injectable()
export class AppService {
  constructor(
    private rssParserService: RssParserService,
    private readonly logger: Logger,
  ) {}
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
    this.logger.debug('AppService.main()');
    const rssConfig = await this.getRssConfig();

    for (const configItem of rssConfig) {
      const { sourceUrl, tagName } = configItem;
      const { items } = await this.rssParserService.parseUrl(sourceUrl);
      for (const item of items) {
        const targetContent = item[tagName];
        const plainTextContent = convert(targetContent, {
          format: 'plain',
          wordwrap: 120,
          selectors: [
            { selector: 'a', options: { ignoreHref: true } },
            { selector: 'img', format: 'skip' },
          ],
        }).replace(/\s+/g, ' ');
        console.log('item', plainTextContent);
      }
    }
  }
}
