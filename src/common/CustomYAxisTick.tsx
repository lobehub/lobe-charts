import { cssVar } from 'antd-style';
import React, { memo } from 'react';

import { ValueFormatter } from '@/types/charts';

interface CustomYAxisTickProps {
  align: 'left' | 'right';
  anchor?: 'end' | 'middle' | 'start';
  formatter: ValueFormatter;

  payload: {
    value: number;
  };

  x: number;
  y: number;
  yAxisLabel?: boolean;
}

const CustomYAxisTick = memo<CustomYAxisTickProps>(
  ({ yAxisLabel, x, y, payload, align, formatter, anchor }) => {
    const yAxisLabelWidth = yAxisLabel ? 24 : 0;
    const resolvedTextAnchor = anchor ?? (align === 'left' ? 'start' : 'end');

    return (
      <g transform={`translate(${align === 'left' ? yAxisLabelWidth : x + yAxisLabelWidth},${y})`}>
        <text
          dy={4}
          fill={cssVar.colorTextDescription}
          fontSize={12}
          textAnchor={resolvedTextAnchor}
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
