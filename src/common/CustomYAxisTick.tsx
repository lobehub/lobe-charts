import { useTheme } from 'antd-style';
import React, { memo } from 'react';

import { ValueFormatter } from '@/types/charts';

interface CustomYAxisTickProps {
  align: 'left' | 'right';
  formatter: ValueFormatter;

  payload: {
    value: number;
  };

  x: number;
  y: number;
  yAxisLabel?: boolean;
}

const CustomYAxisTick = memo<CustomYAxisTickProps>(
  ({ yAxisLabel, x, y, payload, align, formatter }) => {
    const theme = useTheme();

    const yAxisLabelWidth = yAxisLabel ? 24 : 0;

    return (
      <g transform={`translate(${align === 'left' ? yAxisLabelWidth : x + yAxisLabelWidth},${y})`}>
        <text
          dy={4}
          fill={theme.colorTextDescription}
          fontSize={12}
          textAnchor={align === 'left' ? 'start' : 'end'}
          x={0}
          y={0}
        >
          {formatter(payload.value)}
        </text>
      </g>
    );
  },
);

export default CustomYAxisTick;
