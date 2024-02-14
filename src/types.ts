import type {
  CartesianGridProps,
  LabelProps,
  LegendProps,
  ReferenceLineProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
} from 'recharts';

export interface ChartReferenceLineProps extends Omit<ReferenceLineProps, 'ref' | 'label'> {
  color?: string;
  label?: string;
  labelPosition?: LabelProps['position'];
}

export interface ChartSeries {
  color: string;
  label?: string;
  name: string;
}

export type BaseChartStylesNames = 'root' | 'container' | 'axis' | 'grid' | 'referenceLine';

export type ChartData = Record<string, any>[];

export interface GridChartBaseProps {
  /** Data used to display chart */
  data: ChartData;

  /** Key of the `data` object for x-axis values */
  dataKey: string;

  /** Specifies which lines should be displayed in the grid, `'x'` by default */
  gridAxis?: 'x' | 'y' | 'xy' | 'none';

  /** Color of the grid and cursor lines, by default depends on color scheme */
  gridColor?: string;

  /** Props passed down to the `CartesianGrid` component */
  gridProps?: Omit<CartesianGridProps, 'ref'>;

  /** Props passed down to the `Legend` component */
  legendProps?: Omit<LegendProps, 'ref'>;

  /** Chart orientation, `'horizontal'` by default */
  orientation?: 'horizontal' | 'vertical';

  /** Reference lines that should be displayed on the chart */
  referenceLines?: ChartReferenceLineProps[];

  /** Dash array for the grid lines and cursor, `'5 5'` by default */
  strokeDasharray?: string | number;

  /** Color of the text displayed inside the chart, `'dimmed'` by default */
  textColor?: string;

  /** Specifies which axis should have tick line, `'y'` by default */
  tickLine?: 'x' | 'y' | 'xy' | 'none';

  /** Tooltip position animation duration in ms, `0` by default */
  tooltipAnimationDuration?: number;

  /** Props passed down to the `Tooltip` component */
  tooltipProps?: Omit<TooltipProps<any, any>, 'ref'>;

  /** Unit displayed next to each tick in y-axis */
  unit?: string;

  /** A function to format values on Y axis and inside the tooltip */
  valueFormatter?: (value: number) => string;

  /** Determines whether chart legend should be displayed, `false` by default */
  withLegend?: boolean;

  /** Determines whether chart tooltip should be displayed, `true` by default */
  withTooltip?: boolean;

  /** Determines whether x-axis should be hidden, `true` by default */
  withXAxis?: boolean;

  /** Determines whether y-axis should be hidden, `true` by default */
  withYAxis?: boolean;

  /** Props passed down to the `XAxis` recharts component */
  xAxisProps?: Omit<XAxisProps, 'ref'>;

  /** Props passed down to the `YAxis` recharts component */
  yAxisProps?: Omit<YAxisProps, 'ref'>;
}

export type ValueType = number | string | Array<number | string>;
export type NameType = number | string;
