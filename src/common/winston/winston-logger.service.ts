// winston-logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'debug', // 最低记录级别为 debug，以确保所有级别的日志都被处理
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY/MM/DD HH:mm:ss',
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          const pid = process.pid; // 获取进程ID
          return `[User] ${pid} - ${timestamp} ${level.toUpperCase()} ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          level: 'debug', // 打印所有级别的日志
        }),
        new DailyRotateFile({
          level: 'info', // 仅将 info 及以上级别的日志写入文件
          filename: 'logs/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
