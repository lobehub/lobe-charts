import React, { forwardRef } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import ColorSwatch from '@/components/ColorSwatch';
import { ChartSeries } from '@/types';
import { getData } from '@/utils/getData';
import { getFilteredChartTooltipPayload } from '@/utils/getFilteredChartTooltipPayload';
import { getSeriesLabels } from '@/utils/getSeriesLabels';

import { useStyles } from './styles';

export interface ChartTooltipProps extends FlexboxProps {
  /** Main tooltip label */
  label?: React.ReactNode;

  /** Chart data provided by recharts */
  payload: Record<string, any>[] | undefined;

  /** Id of the segment to display data for. Only applicable when `type="radial"`. If not set, all data is rendered. */
  segmentId?: string;

  /** Chart series data, applicable only for `area` type */
  series?: ChartSeries[];

  /** Tooltip type that determines the content and styles, `area` for LineChart, AreaChart and BarChart, `radial` for DonutChart and PieChart, `'area'` by default */
  type?: 'area' | 'radial';

  /** Data units, provided by parent component */
  unit?: string;

  /** A function to format values */
  valueFormatter?: (value: number) => string;
}

const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  (
    { className, payload, type = 'area', label, unit, segmentId, series, valueFormatter, ...rest },
    ref,
  ) => {
    const { cx, styles } = useStyles();

    if (!payload) return null;

    const filteredPayload = getFilteredChartTooltipPayload(payload, segmentId);
    const labels = getSeriesLabels(series);

    const items = filteredPayload.map((item) => (
      <Flexbox align={'center'} gap={24} horizontal justify={'space-between'} key={item.name}>
        <Flexbox align={'center'} gap={8} horizontal>
          <ColorSwatch color={item.color} />
          <div className={styles.itemTitle}>{labels[item.name] || item.name}</div>
        </Flexbox>
        <div className={styles.itemData}>
          {typeof valueFormatter === 'function'
            ? valueFormatter(getData(item, type!))
            : getData(item, type!)}
          {unit}
        </div>
      </Flexbox>
    ));

    return (
      <Flexbox className={cx(styles.container, className)} gap={8} ref={ref} {...rest}>
        {label && <div className={styles.label}>{label}</div>}
        <Flexbox gap={4}>{items}</Flexbox>
      </Flexbox>
    );
  },
);

export default ChartTooltip;
