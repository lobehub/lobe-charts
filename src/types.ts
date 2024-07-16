type FixedProps = {
  categoryClicked: string;
  eventType: 'dot' | 'category' | 'bar' | 'slice' | 'bubble';
};

type BaseEventProps = FixedProps & {
  [key: string]: number | string;
};

export type EventProps = BaseEventProps | null | undefined;

export type Interval = 'preserveStartEnd' | 'equidistantPreserveStart';

export type IntervalType = 'preserveStartEnd' | Interval;

export type CurveType = 'linear' | 'natural' | 'monotone' | 'step';

export type ValueFormatter = {
  (value: number): string;
};

export type ScatterChartValueFormatter = {
  size?: ValueFormatter;
  x?: ValueFormatter;
  y?: ValueFormatter;
};
