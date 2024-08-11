export type RssConfigType = {
  sourceUrl: string;
  customName: string;
  updateInterval: number;
  tagName: string;
  mode: 'mix' | 'summary' | 'keep';
};
