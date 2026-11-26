'use client';

import { css, cssVar, cx, Flexbox, Skeleton } from '@lobehub/ui';
import { Bar, BarChart as ReChartsBarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

import type { A2uiChartProps } from '@/common/a2ui';
import type BaseSparkChartProps from '@/common/BaseSparkChartProps';
import NoData from '@/common/NoData';
import { constructCategoryColors, getYAxisDomain } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';

import A2uiSparkChart, { type A2uiSparkProps } from './A2uiSparkChart';

export interface SparkBarChartProps
  extends BaseSparkChartProps, Omit<A2uiChartProps, 'subtitle'>, A2uiSparkProps {
  loading?: boolean;
  relative?: boolean;
  stack?: boolean;
}

const DefaultSparkBarChart = ({
  ref,
  ...props
}: SparkBarChartProps & { ref?: React.Ref<HTMLDivElement> }) => {
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
          <ReChartsBarChart
            data={data}
            margin={{ bottom: 0, left: -1.5, right: -1.5, top: 0 }}
            stackOffset={relative ? 'expand' : 'none'}
          >
            <YAxis hide domain={yAxisDomain as AxisDomain} />
            <XAxis hide dataKey={index} />
            {categories.map((category) => (
              <Bar
                animationDuration={animationDuration}
                dataKey={category}
                fill=""
                isAnimationActive={showAnimation}
                key={category}
                name={category}
                stackId={stack || relative ? 'a' : undefined}
                type="linear"
                className={cx(css`
                  fill: ${categoryColors.get(category) ?? cssVar.colorPrimary};
                `)}
              />
            ))}
          </ReChartsBarChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
};

const SparkBarChart = ({
  variant = 'default',
  format,
  currency = 'USD',
  unit,
  label,
  value,
  delta,
  tone,
  ref,
  ...props
}: SparkBarChartProps & { ref?: React.Ref<HTMLDivElement> }) => {
  if (variant !== 'a2ui') return <DefaultSparkBarChart ref={ref} {...props} />;
  return (
    <A2uiSparkChart
      categories={props.categories}
      className={props.className}
      currency={currency}
      data={props.data}
      delta={delta}
      format={format}
      index={props.index}
      kind="bar"
      label={label}
      loading={props.loading}
      ref={ref}
      showAnimation={props.showAnimation}
      style={props.style}
      tone={tone}
      unit={unit}
      value={value}
    />
  );
};

SparkBarChart.displayName = 'SparkBarChart';

export default SparkBarChart;
