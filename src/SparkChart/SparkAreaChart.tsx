'use client';

import { css, cssVar, cx, Flexbox, Skeleton } from '@lobehub/ui';
import { Area, AreaChart as ReChartsAreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

import type BaseSparkChartProps from '@/common/BaseSparkChartProps';
import NoData from '@/common/NoData';
import { constructCategoryColors, getYAxisDomain } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import type { CurveType } from '@/types/charts';

export interface SparkAreaChartProps extends BaseSparkChartProps {
  connectNulls?: boolean;
  curveType?: CurveType;
  loading?: boolean;
  showGradient?: boolean;
  stack?: boolean;
}

const SparkAreaChart = ({
  ref,
  ...props
}: SparkAreaChartProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const themeColorRange = useThemeColorRange();

  const {
    data = [],
    categories = [],
    index,
    stack = false,
    colors = themeColorRange,
    showAnimation = false,
    animationDuration = 900,
    showGradient = true,
    curveType = 'linear',
    connectNulls = false,
    noDataText = <div />,
    autoMinValue = false,
    loading,
    minValue,
    maxValue,
    className,
    width = 112,
    height = 48,
    style,
    ...rest
  } = props;

  if (loading || !data) return <Skeleton height={height} width={width} />;

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
          <ReChartsAreaChart data={data} margin={{ bottom: 1, left: 1, right: 1, top: 1 }}>
            <YAxis hide domain={yAxisDomain as AxisDomain} />
            <XAxis hide dataKey={index} />
            {categories.map((category) => {
              return (
                <defs key={category}>
                  {showGradient ? (
                    <linearGradient
                      id={categoryColors.get(category)}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                      className={cx(css`
                        color: ${categoryColors.get(category) ?? cssVar.colorPrimary};
                      `)}
                    >
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  ) : (
                    <linearGradient
                      id={categoryColors.get(category)}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                      className={cx(css`
                        color: ${categoryColors.get(category) ?? cssVar.colorPrimary};
                      `)}
                    >
                      <stop stopColor="currentColor" stopOpacity={0.3} />
                    </linearGradient>
                  )}
                </defs>
              );
            })}
            {categories.map((category) => (
              <Area
                animationDuration={animationDuration}
                connectNulls={connectNulls}
                dataKey={category}
                dot={false}
                fill={`url(#${categoryColors.get(category)})`}
                isAnimationActive={showAnimation}
                key={category}
                name={category}
                stackId={stack ? 'a' : undefined}
                stroke=""
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={1}
                strokeWidth={2}
                type={curveType}
                className={cx(css`
                  stroke: ${categoryColors.get(category) ?? cssVar.colorPrimary};
                `)}
              />
            ))}
          </ReChartsAreaChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
};

SparkAreaChart.displayName = 'AreaChart';

export default SparkAreaChart;
