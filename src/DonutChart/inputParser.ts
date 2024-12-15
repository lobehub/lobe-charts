import { ValueFormatter } from '@/types/charts';
import { sumNumericArray } from '@/utils';

const calculateDefaultLabel = (data: any[], category: string) =>
  sumNumericArray(data.map((dataPoint) => dataPoint[category]));

export const parseLabelInput = (
  labelInput: string | undefined,
  valueFormatter: ValueFormatter,
  data: any[],
  category: string,
) => (labelInput ? labelInput : valueFormatter(calculateDefaultLabel(data, category)));
