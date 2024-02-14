import { ComponentPropsWithoutRef, MouseEvent, forwardRef, useState } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';
import {
  Bar,
  CartesianGrid,
  BarChart as ReChartsBarChart,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

import Legend from '@/components/Legend';
import Tooltip from '@/components/Tooltip';
import XAxis from '@/components/XAxis';
import YAxis from '@/components/YAxis';
import type { ChartSeries } from '@/types';
import { GridChartBaseProps } from '@/types';
import { valueToPercent } from '@/utils/valueToPercent';

import { useStyles } from './styles';

export type BarChartSeries = ChartSeries;

export type BarChartType = 'default' | 'stacked' | 'percent';

export interface BarChartProps extends GridChartBaseProps, FlexboxProps {
  /** Props passed down to recharts `BarChart` component */
  barChartProps?: ComponentPropsWithoutRef<typeof ReChartsBarChart>;

  /** Fill of hovered bar section, by default value is based on color scheme */
  cursorFill?: string;

  /** Data used to display chart */
  data: Record<string, any>[];

  /** Controls fill opacity of all bars, `1` by default */
  fillOpacity?: number;

  /** An array of objects with `name` and `color` keys. Determines which data should be consumed from the `data` array. */
  series: BarChartSeries[];

  /** Controls how bars are positioned relative to each other, `'default'` by default */
  type?: BarChartType;
}

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      className,
      data,
      withLegend = true,
      legendProps,
      series,
      onMouseLeave,
      dataKey,
      withTooltip = true,
      withXAxis = true,
      withYAxis = true,
      gridAxis = 'x',
      tickLine = 'y',
      xAxisProps,
      yAxisProps,
      unit,
      tooltipAnimationDuration = 200,
      strokeDasharray = '4 4',
      gridProps,
      tooltipProps,
      referenceLines,
      fillOpacity = 1,
      barChartProps,
      type = 'default',
      orientation,
      valueFormatter,
      ...rest
    },
    ref,
  ) => {
    const { cx, styles, theme } = useStyles();
    const withXTickLine = gridAxis !== 'none' && (tickLine === 'x' || tickLine === 'xy');
    const withYTickLine = gridAxis !== 'none' && (tickLine === 'y' || tickLine === 'xy');
    const [highlightedArea, setHighlightedArea] = useState<string | null>(null);
    const shouldHighlight = highlightedArea !== null;
    const stacked = type === 'stacked' || type === 'percent';
    const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
      setHighlightedArea(null);
      onMouseLeave?.(event);
    };

    const bars = series.map((item) => {
      const color = item.color;
      const dimmed = shouldHighlight && highlightedArea !== item.name;
      return (
        <Bar
          className={styles.bar}
          dataKey={item.name}
          fill={color}
          fillOpacity={dimmed ? 0.1 : fillOpacity}
          isAnimationActive={false}
          key={item.name}
          name={item.name}
          stackId={stacked ? 'stack' : undefined}
          stroke={color}
          strokeOpacity={dimmed ? 0.2 : 0}
        />
      );
    });

    const referenceLinesItems = referenceLines?.map((line, index) => {
      const color = line.color;
      return (
        <ReferenceLine
          key={index}
          stroke={line.color ? color : theme.colorPrimary}
          strokeWidth={1}
          {...line}
          className={styles.referenceLine}
          label={{
            fill: line.color ? color : theme.colorPrimary,
            position: line.labelPosition ?? 'insideBottomLeft',
            value: line.label,
          }}
        />
      );
    });

    return (
      <Flexbox
        className={cx(styles.root, className)}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        {...rest}
      >
        <ResponsiveContainer className={styles.container}>
          <ReChartsBarChart
            data={data}
            layout={orientation}
            stackOffset={type === 'percent' ? 'expand' : undefined}
            {...barChartProps}
          >
            {withLegend && (
              <Legend onHighlight={setHighlightedArea} series={series} {...legendProps} />
            )}
            <XAxis
              className={styles.axis}
              {...(orientation === 'vertical' ? { type: 'number' } : { dataKey })}
              hide={!withXAxis}
              withXTickLine={withXTickLine}
              {...xAxisProps}
            />
            <YAxis
              className={styles.axis}
              hide={!withYAxis}
              {...(orientation === 'vertical' ? { dataKey, type: 'category' } : { type: 'number' })}
              tickFormatter={type === 'percent' ? valueToPercent : valueFormatter}
              unit={unit}
              withYTickLine={withYTickLine}
              {...yAxisProps}
            />
            <CartesianGrid
              className={styles.grid}
              horizontal={gridAxis === 'x' || gridAxis === 'xy'}
              stroke={theme.colorBorder}
              strokeDasharray={strokeDasharray}
              vertical={gridAxis === 'y' || gridAxis === 'xy'}
              {...gridProps}
            />
            {withTooltip && (
              <Tooltip
                series={series}
                strokeDasharray={strokeDasharray}
                tooltipAnimationDuration={tooltipAnimationDuration}
                unit={unit}
                valueFormatter={valueFormatter}
                {...tooltipProps}
              />
            )}
            {bars}
            {referenceLinesItems}
          </ReChartsBarChart>
        </ResponsiveContainer>
      </Flexbox>
    );
  },
);

export default BarChart;
