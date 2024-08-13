import { Injectable, Logger } from '@nestjs/common';
import { PeriodInfoType } from '../types';

@Injectable()
export class DateTimeService {
  private readonly logger = new Logger(DateTimeService.name);

  parseDateString(dateString: string): Date | null {
    const parsedDate: Date = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      this.logger.error(`无法解析日期字符串: ${dateString}`);
      return null;
    }
    return parsedDate;
  }

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
}
