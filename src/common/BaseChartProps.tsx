import { ComponentType, HTMLAttributes } from 'react';

import type { NoDataProps } from '@/common/NoData';
import { IntervalType, LabelFormatter, ValueFormatter } from '@/types/charts';

import type BaseAnimationTimingProps from './BaseAnimationTimingProps';
import { CustomTooltipProps } from './CustomTooltipProps';

type FixedProps = {
  categoryClicked: string;
  eventType: 'dot' | 'category' | 'bar' | 'slice' | 'bubble';
};

type BaseEventProps = FixedProps & {
  [key: string]: number | string;
};

export type EventProps = BaseEventProps | null | undefined;

interface BaseChartProps extends BaseAnimationTimingProps, HTMLAttributes<HTMLDivElement> {
  allowDecimals?: boolean;
  autoMinValue?: boolean;
  categories: string[];
  colors?: string[];
  customCategories?: {
    [key: string]: string;
  };
  customTooltip?: ComponentType<CustomTooltipProps>;
  data: any[];
  enableLegendSlider?: boolean;
  height?: string | number;
  index: string;
  intervalType?: IntervalType;
  loading?: boolean;
  maxValue?: number;
  minValue?: number;
  noDataText?: NoDataProps['noDataText'];
  onValueChange?: (value: EventProps) => void;
  rotateLabelX?: {
    angle: number;
    verticalShift?: number;
    xAxisHeight?: number;
  };
  showGridLines?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  startEndOnly?: boolean;
  tickGap?: number;
  valueFormatter?: ValueFormatter;
  width?: string | number;
  xAxisLabel?: string;
  xAxisLabelFormatter?: LabelFormatter;
  yAxisAlign?: 'left' | 'right';
  yAxisLabel?: string;
  yAxisWidth?: number;
}

export default BaseChartProps;
