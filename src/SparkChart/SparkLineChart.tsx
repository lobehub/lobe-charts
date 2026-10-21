'use client';

import { css, cssVar, cx, Flexbox, Skeleton } from '@lobehub/ui';
import { Line, LineChart as ReChartsLineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

import type BaseSparkChartProps from '@/common/BaseSparkChartProps';
import NoData from '@/common/NoData';
import { constructCategoryColors, getYAxisDomain } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import type { CurveType } from '@/types/charts';

export interface SparkLineChartProps extends BaseSparkChartProps {
  connectNulls?: boolean;
  curveType?: CurveType;
  loading?: boolean;
}

const SparkLineChart = ({
  ref,
  ...props
}: SparkLineChartProps & { ref?: React.Ref<HTMLDivElement> }) => {
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
          <ReChartsLineChart data={data} margin={{ bottom: 1, left: 1, right: 1, top: 1 }}>
            <YAxis hide domain={yAxisDomain as AxisDomain} />
            <XAxis hide dataKey={index} />
            {categories.map((category) => (
              <Line
                animationDuration={animationDuration}
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
                className={cx(css`
                  stroke: ${categoryColors.get(category) ?? cssVar.colorPrimary};
                `)}
              />
            ))}
          </ReChartsLineChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
};

SparkLineChart.displayName = 'SparkLineChart';

export default SparkLineChart;
