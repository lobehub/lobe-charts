import { useTheme } from 'antd-style';
import { forwardRef } from 'react';
import { Tooltip as RcTooltip, type TooltipProps as RcTooltipProps } from 'recharts';

import { NameType, ValueType } from '@/types';

import ChartTooltip, { type ChartTooltipProps } from './Content';

export interface TooltipProps
  extends RcTooltipProps<ValueType, NameType>,
    Pick<ChartTooltipProps, 'series' | 'unit' | 'valueFormatter'> {
  strokeDasharray?: string | number;
  tooltipAnimationDuration?: number;
}

const Tooltip = forwardRef<any, TooltipProps>(
  ({ series, unit, valueFormatter, strokeDasharray, tooltipAnimationDuration, ...rest }, ref) => {
    const theme = useTheme();

    return (
      <RcTooltip
        animationDuration={tooltipAnimationDuration}
        content={({ payload, label }) => (
          <ChartTooltip
            label={label}
            payload={payload}
            series={series}
            unit={unit}
            valueFormatter={valueFormatter}
          />
        )}
        cursor={{
          fill: theme.colorFillTertiary,
          stroke: theme.colorBorder,
          strokeDasharray,
          strokeWidth: 1,
        }}
        isAnimationActive={tooltipAnimationDuration !== 0}
        position={{ y: 0 }}
        ref={ref as any}
        {...rest}
      />
    );
  },
);

Tooltip.displayName = 'Tooltip';
export default Tooltip;
