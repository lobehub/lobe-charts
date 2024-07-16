import React from 'react';
import { Flexbox } from 'react-layout-kit';

import ChartTooltipFrame from '@/common/ChartTooltip/ChartTooltipFrame';
import ChartTooltipRow from '@/common/ChartTooltip/ChartTooltipRow';
import { ValueFormatter } from '@/types';

export interface DonutChartTooltipProps {
  active: boolean | undefined;
  payload: any;
  valueFormatter: ValueFormatter;
}

export const DonutChartTooltip = ({ active, payload, valueFormatter }: DonutChartTooltipProps) => {
  if (active && payload?.[0]) {
    const payloadRow = payload?.[0];
    return (
      <ChartTooltipFrame>
        <Flexbox paddingBlock={8} paddingInline={16}>
          <ChartTooltipRow
            color={payloadRow.payload.color}
            name={payloadRow.name}
            value={valueFormatter(payloadRow.value)}
          />
        </Flexbox>
      </ChartTooltipFrame>
    );
  }
  return null;
};
