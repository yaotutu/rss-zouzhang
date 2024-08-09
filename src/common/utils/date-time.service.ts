import { Injectable, Logger } from '@nestjs/common';

interface PeriodInfo {
  periodIndex: number;
  startTimestamp: number;
  endTimestamp: number;
}

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
    const currentPeriod: PeriodInfo = this.calculatePeriodForDate(
      currentDate,
      periodInDays,
    );

    const previousPeriodStartTimestamp =
      currentPeriod.startTimestamp - periodInDays * 24 * 60 * 60 * 1000;
    const previousPeriodEndTimestamp = currentPeriod.startTimestamp;

    this.logger.log(
      `当前周期: ${new Date(currentPeriod.startTimestamp).toISOString()} - ${new Date(currentPeriod.endTimestamp).toISOString()}, ` +
        `时间戳: ${currentPeriod.startTimestamp} - ${currentPeriod.endTimestamp}`,
    );

    this.logger.log(
      `上一个周期: ${new Date(previousPeriodStartTimestamp).toISOString()} - ${new Date(previousPeriodEndTimestamp).toISOString()}, ` +
        `时间戳: ${previousPeriodStartTimestamp} - ${previousPeriodEndTimestamp}`,
    );

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
}
