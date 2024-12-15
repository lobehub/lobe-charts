import { NameType, Payload } from 'recharts/types/component/DefaultTooltipContent';

import { ScatterChartValueFormatter } from '@/ScatterChart';
import { ValueFormatter } from '@/types/charts';

export type CustomTooltipProps = {
  active: boolean | undefined;
  customCategories?: {
    [key: string]: string;
  };
  label: NameType | undefined;
  payload: Payload<string | number | (string | number)[], string | number>[] | undefined;
  valueFormatter: ValueFormatter | ScatterChartValueFormatter;
};
