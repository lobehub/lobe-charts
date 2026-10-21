'use client';

import { css, cssVar, cx, Flexbox, Skeleton } from '@lobehub/ui';
import { useMemo, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart as ReChartsComposedChart,
  Label,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartLegend from '@/common/ChartLegend';
import ChartTooltip from '@/common/ChartTooltip';
import CustomYAxisTick from '@/common/CustomYAxisTick';
import NoData from '@/common/NoData';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { defaultValueFormatter } from '@/utils';
import { getMaxLabelLength } from '@/utils/getMaxLabelLength';

import { styles } from './styles';
import type { ComposedChartProps } from './types';

export type { ComposedChartProps, SeriesItem, YAxisConfig } from './types';

const ComposedChart = ({
  ref,
  ...props
}: ComposedChartProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    index,
    series = [],
    yAxisLeft,
    yAxisRight,
    colors = themeColorRange,
    xAxisLabelFormatter = defaultValueFormatter,
    startEndOnly = false,
    animationDuration = 900,
    showAnimation = false,
    showXAxis = true,
    showYAxis = true,
    intervalType = 'equidistantPreserveStart',
    showTooltip = true,
    showLegend = true,
    showGridLines = true,
    allowDecimals = true,
    noDataText,
    enableLegendSlider = false,
    rotateLabelX,
    tickGap = 5,
    loading,
    xAxisLabel,
    className,
    width = '100%',
    height = 280,
    style,
    ...rest
  } = props;

  const [legendHeight, setLegendHeight] = useState(60);

  const seriesColorMap = useMemo(() => {
    const map = new Map<string, string>();
    series.forEach((s, i) => {
      map.set(s.key, s.color ?? colors[i % colors.length]);
    });
    return map;
  }, [series, colors]);

  const categoryColors = seriesColorMap;
  const customCategories = useMemo(() => {
    return series.reduce<Record<string, string>>((acc, item) => {
      if (item.name) acc[item.key] = item.name;
      return acc;
    }, {});
  }, [series]);

  const hasRightAxis = series.some((s) => s.axis === 'right');

  const leftYAxisWidth = useMemo(() => {
    if (yAxisLeft?.width) return yAxisLeft.width;
    const leftFormatter = yAxisLeft?.valueFormatter ?? defaultValueFormatter;
    return getMaxLabelLength({ data, index, layout: 'horizontal', valueFormatter: leftFormatter });
  }, [yAxisLeft, data, index]);

  const rightYAxisWidth = useMemo(() => {
    if (yAxisRight?.width) return yAxisRight.width;
    const rightFormatter = yAxisRight?.valueFormatter ?? defaultValueFormatter;
    return getMaxLabelLength({ data, index, layout: 'horizontal', valueFormatter: rightFormatter });
  }, [yAxisRight, data, index]);

  if (loading || !data) return <Skeleton height={height} width={width} />;

  const paddingValue = !showXAxis && !showYAxis ? 0 : 20;

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
          <ReChartsComposedChart
            data={data}
            margin={{
              bottom: xAxisLabel ? 30 : undefined,
              left: yAxisLeft?.label ? 20 : undefined,
              right: hasRightAxis ? (yAxisRight?.label ? 20 : 5) : undefined,
              top: 5,
            }}
          >
            {showGridLines && (
              <CartesianGrid horizontal className={styles.gridLines} vertical={false} />
            )}

            <XAxis
              angle={rotateLabelX?.angle}
              axisLine={false}
              className={styles.label}
              dataKey={index}
              dy={rotateLabelX?.verticalShift}
              fill=""
              hide={!showXAxis}
              interval={startEndOnly ? 'preserveStartEnd' : intervalType}
              minTickGap={tickGap}
              padding={{ left: paddingValue, right: paddingValue }}
              stroke=""
              tick={{ transform: 'translate(0, 6)' }}
              tickFormatter={xAxisLabelFormatter}
              tickLine={false}
              ticks={startEndOnly ? [data[0][index], data.at(-1)?.[index]] : undefined}
            >
              {xAxisLabel && (
                <Label
                  className={cx(styles.strongLabel, styles.emphasis)}
                  offset={-20}
                  position="insideBottom"
                  style={{
                    fill: cssVar.colorTextSecondary,
                    fontWeight: 500,
                    textAnchor: 'middle',
                  }}
                >
                  {xAxisLabel}
                </Label>
              )}
            </XAxis>

            {/* Left Y Axis */}
            <YAxis
              allowDecimals={allowDecimals}
              axisLine={false}
              className={styles.label}
              domain={yAxisLeft?.domain}
              fill=""
              hide={!showYAxis}
              orientation="left"
              stroke=""
              tickFormatter={yAxisLeft?.valueFormatter ?? defaultValueFormatter}
              tickLine={false}
              type="number"
              width={leftYAxisWidth}
              yAxisId="left"
              tick={(tickProps) => (
                <CustomYAxisTick
                  {...tickProps}
                  align="left"
                  formatter={yAxisLeft?.valueFormatter ?? defaultValueFormatter}
                  yAxisLabel={Boolean(yAxisLeft?.label)}
                />
              )}
            >
              {yAxisLeft?.label && (
                <Label
                  angle={-90}
                  className={styles.emphasis}
                  offset={-15}
                  position="insideLeft"
                  style={{
                    fill: cssVar.colorTextSecondary,
                    fontWeight: 500,
                    textAnchor: 'middle',
                  }}
                >
                  {yAxisLeft.label}
                </Label>
              )}
            </YAxis>

            {/* Right Y Axis */}
            {hasRightAxis && (
              <YAxis
                allowDecimals={allowDecimals}
                axisLine={false}
                className={styles.label}
                domain={yAxisRight?.domain}
                fill=""
                hide={!showYAxis}
                orientation="right"
                stroke=""
                tickFormatter={yAxisRight?.valueFormatter ?? defaultValueFormatter}
                tickLine={false}
                type="number"
                width={rightYAxisWidth}
                yAxisId="right"
                tick={(tickProps) => (
                  <CustomYAxisTick
                    {...tickProps}
                    align="right"
                    anchor="start"
                    formatter={yAxisRight?.valueFormatter ?? defaultValueFormatter}
                    yAxisLabel={Boolean(yAxisRight?.label)}
                  />
                )}
              >
                {yAxisRight?.label && (
                  <Label
                    angle={90}
                    className={styles.emphasis}
                    offset={-15}
                    position="insideRight"
                    style={{
                      fill: cssVar.colorTextSecondary,
                      fontWeight: 500,
                      textAnchor: 'middle',
                    }}
                  >
                    {yAxisRight.label}
                  </Label>
                )}
              </YAxis>
            )}

            {showLegend && (
              <Legend
                height={legendHeight}
                verticalAlign="top"
                content={({ payload }) =>
                  ChartLegend(
                    { payload },
                    categoryColors,
                    setLegendHeight,
                    undefined,
                    undefined,
                    enableLegendSlider,
                    customCategories,
                  )
                }
              />
            )}

            {series.map((s) => {
              const color = seriesColorMap.get(s.key) ?? cssVar.colorPrimary;
              const axisId = s.axis ?? 'left';

              if (s.type === 'bar') {
                return (
                  <Bar
                    animationDuration={animationDuration}
                    dataKey={s.key}
                    fill=""
                    isAnimationActive={showAnimation}
                    key={s.key}
                    name={s.key}
                    yAxisId={axisId}
                    className={cx(css`
                      fill: ${color};
                    `)}
                  />
                );
              }

              if (s.type === 'line') {
                return (
                  <Line
                    animationDuration={animationDuration}
                    dataKey={s.key}
                    dot={false}
                    isAnimationActive={showAnimation}
                    key={s.key}
                    name={s.key}
                    stroke=""
                    strokeWidth={2}
                    type="monotone"
                    yAxisId={axisId}
                    className={cx(css`
                      stroke: ${color};
                    `)}
                  />
                );
              }

              return null;
            })}

            {showTooltip && (
              <Tooltip
                cursor={{ stroke: cssVar.colorTextSecondary, strokeWidth: 1 }}
                isAnimationActive={false}
                position={{ y: 0 }}
                wrapperStyle={{ outline: 'none' }}
                content={({ active, payload, label }) => (
                  <ChartTooltip
                    active={active}
                    categoryColors={categoryColors}
                    customCategories={customCategories}
                    label={label}
                    payload={payload}
                    valueFormatter={(value, name) => {
                      const currentSeries = series.find((item) => item.key === name);
                      const formatter =
                        currentSeries?.valueFormatter ??
                        (currentSeries?.axis === 'right'
                          ? yAxisRight?.valueFormatter
                          : yAxisLeft?.valueFormatter) ??
                        defaultValueFormatter;

                      return formatter(value);
                    }}
                  />
                )}
              />
            )}
          </ReChartsComposedChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
};

ComposedChart.displayName = 'ComposedChart';

export default ComposedChart;
