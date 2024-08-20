import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as fs from 'fs';
import path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { GenerateService } from './common/generate/generate.service';
import { RssParserService } from './common/rss-parser/rss-parser.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => {
          const configPath = path.resolve(__dirname, '..', 'rss-config.json');
          const configFile = fs.readFileSync(configPath, 'utf-8');
          return { rssConfig: JSON.parse(configFile) };
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RssParserService, GenerateService],
})
export class AppModule {}
