import { HTMLAttributes } from 'react';

import { NoDataProps } from '@/common/NoData';

import BaseAnimationTimingProps from './BaseAnimationTimingProps';

interface BaseSparkChartProps extends BaseAnimationTimingProps, HTMLAttributes<HTMLDivElement> {
  autoMinValue?: boolean;
  categories: string[];
  colors?: string[];
  data: any[];
  index: string;
  maxValue?: number;
  minValue?: number;
  noDataText?: NoDataProps['noDataText'];
}

export default BaseSparkChartProps;
