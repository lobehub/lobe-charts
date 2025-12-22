'use client';

import { Flexbox } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { css } from 'antd-style';
import { forwardRef } from 'react';
import { Bar, BarChart as ReChartsBarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

import { useStyles } from '@/BarChart/styles';
import BaseSparkChartProps from '@/common/BaseSparkChartProps';
import NoData from '@/common/NoData';
import { constructCategoryColors, getYAxisDomain } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';

export interface SparkBarChartProps extends BaseSparkChartProps {
  loading?: boolean;
  relative?: boolean;
  stack?: boolean;
}

const SparkBarChart = forwardRef<HTMLDivElement, SparkBarChartProps>((props, ref) => {
  const { cx, theme } = useStyles();
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    categories = [],
    index,
    colors = themeColorRange,
    stack = false,
    relative = false,
    animationDuration = 900,
    showAnimation = false,
    noDataText = <div />,
    loading,
    autoMinValue = false,
    minValue,
    maxValue,
    className,
    width = 112,
    height = 48,
    style,
    ...rest
  } = props;

  if (loading || !data) return <Skeleton.Button active block style={{ height, width }} />;

  const categoryColors = constructCategoryColors(categories, colors);
  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);

  return (
    <Flexbox
      className={className}
      height={height}
      ref={ref}
      style={{ position: 'relative', ...style }}
      width={width}
      {...rest}
    >
      <ResponsiveContainer>
        {data?.length ? (
          <ReChartsBarChart
            data={data}
            margin={{ bottom: 0, left: -1.5, right: -1.5, top: 0 }}
            stackOffset={relative ? 'expand' : 'none'}
          >
            <YAxis domain={yAxisDomain as AxisDomain} hide />
            <XAxis dataKey={index} hide />
            {categories.map((category) => (
              <Bar
                animationDuration={animationDuration}
                className={cx(css`
                  fill: ${categoryColors.get(category) ?? theme.colorPrimary};
                `)}
                dataKey={category}
                fill=""
                isAnimationActive={showAnimation}
                key={category}
                name={category}
                stackId={stack || relative ? 'a' : undefined}
                type="linear"
              />
            ))}
          </ReChartsBarChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
});

SparkBarChart.displayName = 'SparkBarChart';

export default SparkBarChart;
