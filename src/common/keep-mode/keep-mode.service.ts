import { Injectable, Logger } from '@nestjs/common';

type KeepModeItemtype = {
  title: string;
  link: string;
  pubDate: string;
  content: string;
};

@Injectable()
export class KeepModeService {
  constructor(private readonly logger: Logger) {}
  generateFeed(items: any[], tagName: string) {
    const res = items.map((item) => {
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item[tagName],
      };
    });
    this.logger.verbose('res', JSON.stringify(res));
  }
}
