export type RssConfigType = {
  sourceUrl: string;
  customName: string;
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
