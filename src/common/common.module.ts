import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { GenerateService } from './generate/generate.service';
import { GetFeedService } from './get-feed/get-feed.service';
import { HttpClientService } from './http-client/http-client.service';
import { KeepModeService } from './keep-mode/keep-mode.service';
import { SummarizeService } from './langchainjs/summarize.setvice';
import { ArticleService } from './prisma/article.service';
import { PrismaService } from './prisma/prisma.service';
import { RssParserService } from './rss-parser/rss-parser.service';
import { TaskService } from './task/task.service';
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
    PrismaService,
    ArticleService,
    GenerateService,
    GetFeedService,
    {
      provide: Logger,
      useExisting: WinstonLoggerService,
    },
    TaskService,
  ],
  exports: [
    RssParserService,
    HttpClientService,
    Logger,
    SummarizeService,
    DateTimeService,
    KeepModeService,
    ArticleService,
    GenerateService,
    GetFeedService,
  ],
})
export class CommonModule {}
