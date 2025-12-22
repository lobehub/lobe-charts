import { Flexbox } from '@lobehub/ui';
import React from 'react';

import ChartTooltipFrame from '@/common/ChartTooltip/ChartTooltipFrame';
import ChartTooltipRow from '@/common/ChartTooltip/ChartTooltipRow';
import { ValueFormatter } from '@/types/charts';

export interface DonutChartTooltipProps {
  active: boolean | undefined;
  customCategories?: {
    [key: string]: string;
  };
  payload: any;
  valueFormatter: ValueFormatter;
}

export const DonutChartTooltip = ({
  customCategories,
  active,
  payload,
  valueFormatter,
}: DonutChartTooltipProps) => {
  if (active && payload?.[0]) {
    const payloadRow = payload?.[0];
    return (
      <ChartTooltipFrame>
        <Flexbox paddingBlock={8} paddingInline={16}>
          <ChartTooltipRow
            color={payloadRow.payload.color}
            name={customCategories?.[payloadRow.name] || payloadRow.name}
            value={valueFormatter(payloadRow.value)}
          />
        </Flexbox>
      </ChartTooltipFrame>
    );
  }
  return null;
};
