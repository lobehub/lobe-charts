'use client';

import { Flexbox } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { css } from 'antd-style';
import { forwardRef } from 'react';
import { Line, LineChart as ReChartsLineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

import { useStyles } from '@/LineChart/styles';
import BaseSparkChartProps from '@/common/BaseSparkChartProps';
import NoData from '@/common/NoData';
import { constructCategoryColors, getYAxisDomain } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { CurveType } from '@/types/charts';

export interface SparkLineChartProps extends BaseSparkChartProps {
  connectNulls?: boolean;
  curveType?: CurveType;
  loading?: boolean;
}

const SparkLineChart = forwardRef<HTMLDivElement, SparkLineChartProps>((props, ref) => {
  const { cx, theme } = useStyles();
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    categories = [],
    index,
    colors = themeColorRange,
    animationDuration = 900,
    showAnimation = false,
    curveType = 'linear',
    connectNulls = false,
    noDataText = <div />,
    autoMinValue = false,
    minValue,
    maxValue,
    className,
    width = 112,
    height = 48,
    style,
    loading,
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
          <ReChartsLineChart data={data} margin={{ bottom: 1, left: 1, right: 1, top: 1 }}>
            <YAxis domain={yAxisDomain as AxisDomain} hide />
            <XAxis dataKey={index} hide />
            {categories.map((category) => (
              <Line
                animationDuration={animationDuration}
                className={cx(css`
                  stroke: ${categoryColors.get(category) ?? theme.colorPrimary};
                `)}
                connectNulls={connectNulls}
                dataKey={category}
                dot={false}
                isAnimationActive={showAnimation}
                key={category}
                name={category}
                stroke=""
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={1}
                strokeWidth={2}
                type={curveType}
              />
            ))}
          </ReChartsLineChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
});

SparkLineChart.displayName = 'SparkLineChart';

export default SparkLineChart;
