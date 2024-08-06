import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { HttpClientService } from './http-client/http-client.service';
import { RssParserService } from './rss-parser/rss-parser.service';
import { WinstonLoggerService } from './winston/winston-logger.service';

@Module({
  imports: [HttpModule],
  providers: [
    RssParserService,
    HttpClientService,
    WinstonLoggerService,
    {
      provide: Logger,
      useExisting: WinstonLoggerService,
    },
  ],
  exports: [RssParserService, HttpClientService, Logger],
})
export class CommonModule {}
