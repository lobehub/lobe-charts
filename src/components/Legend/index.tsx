import { forwardRef } from 'react';
import { Legend as RcLegend, type LegendProps as RcLegendProps } from 'recharts';

import ChartLegend, { type ChartLegendProps } from './Content';

export interface TooltipProps
  extends RcLegendProps,
    Pick<ChartLegendProps, 'onHighlight' | 'series'> {
  strokeDasharray?: string | number;
  tooltipAnimationDuration?: number;
}

const Legend = forwardRef<any, TooltipProps>(({ onHighlight, series, ...rest }, ref) => {
  return (
    <RcLegend
      content={({ payload }) => (
        <ChartLegend onHighlight={onHighlight} payload={payload} series={series} />
      )}
      ref={ref as any}
      verticalAlign="top"
      {...rest}
    />
  );
});

Legend.displayName = 'Legend';
export default Legend;
