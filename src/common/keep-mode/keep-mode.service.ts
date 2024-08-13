import { Injectable, Logger } from '@nestjs/common';
import React from 'react'; // Import the 'React' module
import ReactDOMServer from 'react-dom/server';
import { KeepModeItemtype, PeriodInfoType } from '../types';
import KeepMode from './KeepMode';

@Injectable()
export class KeepModeService {
  constructor(private readonly logger: Logger) {}
  generateFeed(
    items: any[],
    tagName: string,
    title: string,
    period: PeriodInfoType,
  ) {
    const res: KeepModeItemtype[] = items.map((item) => {
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item[tagName],
      };
    });
    // this.logger.verbose('res', JSON.stringify(res));
    const jsxElement = React.createElement(KeepMode, {
      items: res,
      title,
      period,
    });
    const html = ReactDOMServer.renderToString(jsxElement);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>${html}`;
    return xml;
  }
}
