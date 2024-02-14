import React, { forwardRef } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import ColorSwatch from '@/components/ColorSwatch';
import type { ChartSeries } from '@/types';
import { getFilteredChartLegendPayload } from '@/utils/getFilteredChartLegendPayload';
import { getSeriesLabels } from '@/utils/getSeriesLabels';

import { useStyles } from './styles';

export interface ChartLegendProps extends FlexboxProps {
  onHighlight: (area: string | null) => void;
  payload: Record<string, any>[] | undefined;
  series?: ChartSeries[];
}

const ChartLegend = forwardRef<HTMLDivElement, ChartLegendProps>(
  ({ className, payload, onHighlight, series, ...rest }, ref) => {
    const { cx, styles } = useStyles();

    if (!payload) {
      return null;
    }

    const filteredPayload = getFilteredChartLegendPayload(payload);
    const labels = getSeriesLabels(series);

    const items = filteredPayload.map((item, index) => (
      <Flexbox
        align={'center'}
        className={styles.item}
        gap={8}
        horizontal
        key={index}
        onMouseEnter={() => onHighlight(item.dataKey)}
        onMouseLeave={() => onHighlight(null)}
      >
        <ColorSwatch color={item.color} />
        <div className={styles.itemName}>{labels[item.dataKey] || item.dataKey}</div>
      </Flexbox>
    ));

    return (
      <Flexbox
        align={'center'}
        className={cx(styles.container, className)}
        gap={8}
        horizontal
        justify={'flex-end'}
        ref={ref}
        style={styles}
        {...rest}
      >
        {items}
      </Flexbox>
    );
  },
);

export default ChartLegend;
