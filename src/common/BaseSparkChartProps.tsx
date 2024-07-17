import { HTMLAttributes } from 'react';

import BaseAnimationTimingProps from './BaseAnimationTimingProps';

interface BaseSparkChartProps extends BaseAnimationTimingProps, HTMLAttributes<HTMLDivElement> {
  autoMinValue?: boolean;
  categories: string[];
  colors?: string[];
  data: any[];
  index: string;
  maxValue?: number;
  minValue?: number;
  noDataText?: string;
}

export default BaseSparkChartProps;
