// winston-logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

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
        winston.format.printf(({ timestamp, level, message, source }) => {
          const pid = process.pid; // 获取进程ID
          return `[Winston] ${pid} - ${timestamp}   ${level.toUpperCase()} [${source}] ${message}`;
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

  log(message: string, source: string) {
    this.logger.info({ message, source });
  }

  error(message: string, trace: string, source: string) {
    this.logger.error({ message: `${message} - ${trace}`, source });
  }

  warn(message: string, source: string) {
    this.logger.warn({ message, source });
  }

  debug(message: string, source: string) {
    this.logger.debug({ message, source });
  }

  verbose(message: string, source: string) {
    this.logger.verbose({ message, source });
  }
}
