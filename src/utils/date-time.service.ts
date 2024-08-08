import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DateTimeService {
  private readonly logger = new Logger(DateTimeService.name);

  /**
   * 将时间字符串转换为时间戳
   * @param dateTimeStr 时间字符串，可以是任意格式的时间
   * @returns 转换后的时间戳，如果时间格式不合法则返回 null
   */
  parseDateToTimestamp(dateTimeStr: string): number | null {
    // 尝试解析时间字符串
    const parsedDate = new Date(dateTimeStr);

    // 检查解析结果是否有效
    if (isNaN(parsedDate.getTime())) {
      // 如果无法解析出有效时间，则记录日志并返回 null
      this.logger.error(`无法解析时间字符串: "${dateTimeStr}"`);
      return null;
    }

    // 返回时间戳（单位：毫秒）
    return parsedDate.getTime();
  }
  /**
   * 检查时间戳是否在当前日期和前 n 天之间（以当天中午12点为结算点）
   * @param timestampStr 时间戳字符串
   * @param days 天数
   * @returns 如果时间戳在区间内则返回 true，否则返回 false
   */
  isTimestampWithinDays(timestampStr: string, days: number): boolean {
    const now = new Date();
    const currentNoon = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      12,
      0,
      0,
    ).getTime();
    const pastNoon = currentNoon - days * 24 * 60 * 60 * 1000;

    const timestamp = this.parseDateToTimestamp(timestampStr);
    if (timestamp === null) {
      return false;
    }

    return timestamp >= pastNoon && timestamp <= currentNoon;
  }
}
