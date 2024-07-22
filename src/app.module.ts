import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { RssParserService } from './common/rss-parser/rss-parser.service';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [AppService, RssParserService],
})
export class AppModule {}
