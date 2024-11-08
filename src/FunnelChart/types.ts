export type Tooltip = {
  data?: {
    className?: string;
    color?: string;
    dataKey: string;
    fill?: string;
    name: string;
    payload?: any;
    value: number;
  };
  index?: number;
  x: number;
  y: number;
};

export type DataT = {
  name: string;
  value: number;
};

export type FormattedDataT = DataT & {
  barHeight: number;
  nextBarHeight: number;
  nextNormalizedValue: number;
  nextStartX: number;
  nextValue: number;
  normalizedValue: number;
  startX: number;
  startY: number;
};
