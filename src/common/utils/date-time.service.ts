import { Injectable, Logger } from '@nestjs/common';

// 定义返回结果的类型
interface PeriodInfo {
  periodIndex: number; // 周期索引
  startTimestamp: number; // 周期开始时间戳（毫秒数）
  endTimestamp: number; // 周期结束时间戳（毫秒数）
}

@Injectable()
export class DateTimeService {
  private readonly logger = new Logger(DateTimeService.name);

  /**
   * 解析任意格式的日期字符串，并转换为合法的 Date 对象。
   *
   * @param {string} dateString - 任意格式的日期字符串。
   * @returns {Date | null} - 返回合法的 Date 对象或 null（如果解析失败）。
   */
  parseDateString(dateString: string): Date | null {
    const parsedDate: Date = new Date(dateString);

    if (isNaN(parsedDate.getTime())) {
      this.logger.error(`无法解析日期字符串: ${dateString}`);
      return null;
    }

    return parsedDate;
  }

  /**
   * 计算给定日期所在的周期，并返回周期的起始和结束时间（以时间戳形式表示）。
   *
   * @param {Date} date - 要计算周期的日期。
   * @param {number} periodInDays - 每个周期的长度（以天为单位）。
   * @returns {PeriodInfo} - 包含周期索引、周期起始时间戳和结束时间戳的对象。
   */
  calculatePeriodForDate(date: Date, periodInDays: number): PeriodInfo {
    const baseDate: Date = new Date('2024-01-01T00:00:00Z');
    const daysSinceBase: number = Math.floor(
      (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const currentPeriodIndex: number = Math.floor(daysSinceBase / periodInDays);
    const periodStart: Date = new Date(baseDate);
    periodStart.setDate(baseDate.getDate() + currentPeriodIndex * periodInDays);
    const periodEnd: Date = new Date(periodStart);
    periodEnd.setDate(periodStart.getDate() + periodInDays);
    return {
      periodIndex: currentPeriodIndex,
      startTimestamp: periodStart.getTime(),
      endTimestamp: periodEnd.getTime(),
    };
  }

  /**
   * 判断给定的日期是否在当前日期所在的周期范围内。
   *
   * @param {string | Date} dateInput - 要判断的日期，可以是字符串或 Date 对象。
   * @param {number} periodInDays - 每个周期的长度（以天为单位）。
   * @returns {boolean} - 如果日期在当前日期所在的周期范围内，返回 true；否则返回 false。
   */
  isDateInCurrentPeriod(
    dateInput: string | Date,
    periodInDays: number,
  ): boolean {
    // 如果输入是字符串，先解析成 Date 对象
    const date =
      typeof dateInput === 'string'
        ? this.parseDateString(dateInput)
        : dateInput;

    // 如果解析失败，返回 false
    if (!date) {
      this.logger.error(`日期无效: ${dateInput}`);
      return false;
    }

    const currentDate: Date = new Date();
    const periodForGivenDate: PeriodInfo = this.calculatePeriodForDate(
      date,
      periodInDays,
    );
    const periodForCurrentDate: PeriodInfo = this.calculatePeriodForDate(
      currentDate,
      periodInDays,
    );

    const isSamePeriod =
      periodForGivenDate.periodIndex === periodForCurrentDate.periodIndex;
    const isInRange =
      date.getTime() >= periodForCurrentDate.startTimestamp &&
      date.getTime() < periodForCurrentDate.endTimestamp;

    return isSamePeriod && isInRange;
  }
}
