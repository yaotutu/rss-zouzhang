import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { HttpClientService } from './http-client/http-client.service';
import { KeepModeService } from './keep-mode/keep-mode.service';
import { SummarizeService } from './langchainjs/summarize.setvice';
import { RssParserService } from './rss-parser/rss-parser.service';
import { DateTimeService } from './utils/date-time.service';
import { WinstonLoggerService } from './winston/winston-logger.service';

@Module({
  imports: [HttpModule],
  providers: [
    RssParserService,
    HttpClientService,
    WinstonLoggerService,
    SummarizeService,
    DateTimeService,
    KeepModeService,
    {
      provide: Logger,
      useExisting: WinstonLoggerService,
    },
  ],
  exports: [
    RssParserService,
    HttpClientService,
    Logger,
    SummarizeService,
    DateTimeService,
    KeepModeService,
  ],
})
export class CommonModule {}
