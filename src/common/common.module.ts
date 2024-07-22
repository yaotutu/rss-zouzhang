import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpClientService } from './http-client/http-client.service';
import { RssParserService } from './rss-parser/rss-parser.service';

@Module({
  imports: [HttpModule],
  providers: [RssParserService, HttpClientService],
  exports: [RssParserService, HttpClientService],
})
export class CommonModule {}
