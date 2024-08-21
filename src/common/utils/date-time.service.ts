import { Injectable, Logger } from '@nestjs/common';
import { PeriodInfoType } from '../types';

@Injectable()
export class DateTimeService {
  private readonly logger = new Logger(DateTimeService.name);

  /**
   * Parses a date string and returns a Date object.
   *
   * @param dateString - The date string to parse.
   * @returns The parsed Date object, or null if the date string is invalid.
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
   * Formats a date string into a specified format.
   *
   * @param dateString - The date string to format.
   * @param format - The format string, supports 'yymmdd', 'mmdd', 'yy', 'mm', 'dd'.
   * @returns The formatted date string, or null if the date string is invalid or the format is unsupported.
   */
  formatDateToString(
    dateString: string,
    format: string = 'yymmdd',
  ): string | null {
    const date: Date | null = this.parseDateString(dateString);

    if (!date) {
      this.logger.error(`无法格式化日期: ${dateString}`);
      return null;
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，因此需要加1
    const day = date.getDate();

    switch (format) {
      case 'yymmdd':
        return `${year}年${month}月${day}日`;
      case 'mmdd':
        return `${month}月${day}日`;
      case 'yy':
        return `${year}年`;
      case 'mm':
        return `${month}月`;
      case 'dd':
        return `${day}日`;
      default:
        this.logger.error(`不支持的格式: ${format}`);
        return null;
    }
  }

  /**
   * Calculates the period information for a given date.
   *
   * @param date - The date for which to calculate the period.
   * @param periodInDays - The length of each period in days.
   * @returns The period information including the period index, start timestamp, and end timestamp.
   */
  calculatePeriodForDate(date: Date, periodInDays: number): PeriodInfoType {
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
   * Checks if a given date falls within a specified period.
   *
   * @param dateInput - The date to check. It can be either a string or a Date object.
   * @param periodInDays - The duration of the period in days.
   * @param checkPreviousPeriod - Optional. Specifies whether to check the previous period. Default is true.
   * @returns A boolean indicating whether the date falls within the specified period.
   */
  checkDateInPeriod(
    dateInput: string | Date,
    periodInDays: number,
    checkPreviousPeriod: boolean = true,
  ): boolean {
    const date =
      typeof dateInput === 'string'
        ? this.parseDateString(dateInput)
        : dateInput;

    if (!date) {
      this.logger.error(`日期无效: ${dateInput}`);
      return false;
    }

    const currentDate: Date = new Date();
    const currentPeriod: PeriodInfoType = this.calculatePeriodForDate(
      currentDate,
      periodInDays,
    );

    const previousPeriodStartTimestamp =
      currentPeriod.startTimestamp - periodInDays * 24 * 60 * 60 * 1000;
    const previousPeriodEndTimestamp = currentPeriod.startTimestamp;

    if (checkPreviousPeriod) {
      return (
        date.getTime() >= previousPeriodStartTimestamp &&
        date.getTime() < previousPeriodEndTimestamp
      );
    } else {
      return (
        date.getTime() >= currentPeriod.startTimestamp &&
        date.getTime() < currentPeriod.endTimestamp
      );
    }
  }

  /**
   * Retrieves the period information for a given date string.
   *
   * @param dateString - The date string to retrieve the period information for.
   * @param periodInDays - The number of days in a period.
   * @returns The period information for the given date string, or null if the date is invalid.
   */
  getPeriodInfoForDateString(
    dateString: string,
    periodInDays: number,
  ): PeriodInfoType | null {
    const date = this.parseDateString(dateString);

    if (!date) {
      this.logger.error(`日期无效: ${dateString}`);
      return null;
    }

    const periodInfo = this.calculatePeriodForDate(date, periodInDays);

    this.logger.log(
      `日期 ${dateString} 所在周期: ${periodInfo.periodIndex}, ` +
        `周期开始时间: ${new Date(periodInfo.startTimestamp).toISOString()}, ` +
        `周期结束时间: ${new Date(periodInfo.endTimestamp).toISOString()}`,
    );

    return periodInfo;
  }

  getCurrentPeriodInfo(periodInDays: number): PeriodInfoType | null {
    const currentDate = new Date();

    const periodInfo = this.calculatePeriodForDate(currentDate, periodInDays);

    this.logger.log(
      `当前时间 ${currentDate.toISOString()} 所在周期: ${periodInfo.periodIndex}, ` +
        `周期开始时间: ${new Date(periodInfo.startTimestamp).toISOString()}, ` +
        `周期结束时间: ${new Date(periodInfo.endTimestamp).toISOString()}`,
    );

    return periodInfo;
  }
}
