export type RssConfigType = {
  sourceUrl: string;
  customTitle: string;
  updateInterval: number;
  tagName: string;
  mode: 'mix' | 'summary' | 'keep';
};

export type KeepModeItemtype = {
  title: string;
  link: string;
  pubDate: string;
  content: string;
};

export type PeriodInfoType = {
  periodIndex: number; // 周期索引，从基准日期开始计算的第几个周期
  startTimestamp: number; // 当前周期的开始时间戳
  endTimestamp: number; // 当前周期的结束时间戳
};

export type PeriodCheckResultType = {
  isInCurrentPeriod: boolean; // 日期是否在当前周期内
  isInPreviousPeriod: boolean; // 日期是否在上一个周期内
  currentPeriod: { start: Date; end: Date }; // 当前周期的起止日期
  previousPeriod: { start: Date; end: Date }; // 上一个周期的起止日期
  periodIndex: number; // 当前周期的索引
};
