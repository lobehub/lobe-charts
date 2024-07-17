import type {
  AnimationEvent,
  ClipboardEvent,
  CompositionEvent,
  DOMAttributes,
  DragEvent,
  FocusEvent,
  FormEvent,
  HTMLAttributes,
  JSXElementConstructor,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactElement,
  SVGAttributes,
  SyntheticEvent,
  TouchEvent,
  TransitionEvent,
  UIEvent,
  WheelEvent,
} from 'react';

export interface Activity {
  count: number;
  date: string;
  level: number;
}

export type Week = Array<Activity | undefined>;

export type Labels = Partial<{
  legend: Partial<{
    less: string;
    more: string;
  }>;
  months: Array<string>;
  tooltip: string;
  totalCount: string;
  weekdays: Array<string>;
}>;

interface BlockAttributes extends SVGAttributes<SVGRectElement>, HTMLAttributes<SVGRectElement> {}

export type BlockElement = ReactElement<BlockAttributes, JSXElementConstructor<SVGRectElement>>;

export type SVGRectEventHandler = Omit<
  DOMAttributes<SVGRectElement>,
  'css' | 'children' | 'dangerouslySetInnerHTML'
>;

export type EventHandlerMap = {
  [key in keyof SVGRectEventHandler]: (
    ...event: Parameters<NonNullable<SVGRectEventHandler[keyof SVGRectEventHandler]>>
  ) => (activity: Activity) => void;
};

export type ReactEvent<E extends Element> = AnimationEvent<E> &
  ClipboardEvent<E> &
  CompositionEvent<E> &
  DragEvent<E> &
  FocusEvent<E> &
  FormEvent<E> &
  KeyboardEvent<E> &
  MouseEvent<E> &
  PointerEvent<E> &
  SyntheticEvent<E> &
  TouchEvent<E> &
  TransitionEvent<E> &
  UIEvent<E> &
  WheelEvent<E>;

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
