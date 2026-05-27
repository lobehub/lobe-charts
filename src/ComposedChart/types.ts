import type { HTMLAttributes } from 'react';
import type { AxisDomain } from 'recharts/types/util/types';

import type { NoDataProps } from '@/common/NoData';
import type { IntervalType, LabelFormatter, ValueFormatter } from '@/types/charts';

import type BaseAnimationTimingProps from '../common/BaseAnimationTimingProps';

export interface SeriesItem {
  /**
   * Which y-axis this series is bound to.
   * @default 'left'
   */
  axis?: 'left' | 'right';
  /** Override color for this series. Falls back to the chart-level `colors` array. */
  color?: string;
  /** Data key in the `data` array */
  key: string;
  /** Display name shown in legend / tooltip. Defaults to `key`. */
  name?: string;
  /** Chart type for this series */
  type: 'bar' | 'line';
  /** Per-series value formatter used in tooltip */
  valueFormatter?: ValueFormatter;
}

export interface YAxisConfig {
  /**
   * Forward to recharts `YAxis.domain`.
   * Accepts numbers or `'auto'` / `'dataMin'` / `'dataMax'` / `'dataMin - N'` etc.
   */
  domain?: AxisDomain;
  /** Label string rendered alongside the axis */
  label?: string;
  /** Custom tick formatter */
  valueFormatter?: ValueFormatter;
  /** Fixed axis width in pixels */
  width?: number;
}

export interface ComposedChartProps
  extends BaseAnimationTimingProps, HTMLAttributes<HTMLDivElement> {
  allowDecimals?: boolean;
  colors?: string[];
  data: any[];
  enableLegendSlider?: boolean;
  height?: string | number;
  /** The key in `data` used as the shared x-axis category */
  index: string;
  intervalType?: IntervalType;
  loading?: boolean;
  noDataText?: NoDataProps['noDataText'];
  rotateLabelX?: {
    angle: number;
    verticalShift?: number;
    xAxisHeight?: number;
  };
  /** Series definitions — each item maps to a Bar or Line renderer */
  series: SeriesItem[];
  showGridLines?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  startEndOnly?: boolean;
  tickGap?: number;
  width?: string | number;
  xAxisLabel?: string;
  xAxisLabelFormatter?: LabelFormatter;
  /** Left y-axis configuration */
  yAxisLeft?: YAxisConfig;
  /** Right y-axis configuration */
  yAxisRight?: YAxisConfig;
}
