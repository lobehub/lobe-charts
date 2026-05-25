'use client';

import { Flexbox, Skeleton } from '@lobehub/ui';
import { css, cssVar, cx } from 'antd-style';
import { forwardRef, useMemo, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Label,
  Legend,
  Line,
  ComposedChart as ReChartsComposedChart,
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

export type { ComposedChartProps, SeriesItem } from './types';

const ComposedChart = forwardRef<HTMLDivElement, ComposedChartProps>((props, ref) => {
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

  if (loading || !data) return <Skeleton.Block active height={height} width={width} />;

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
              <CartesianGrid className={styles.gridLines} horizontal vertical={false} />
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
              fill=""
              hide={!showYAxis}
              orientation="left"
              stroke=""
              tick={(tickProps) => (
                <CustomYAxisTick
                  {...tickProps}
                  align="left"
                  formatter={yAxisLeft?.valueFormatter ?? defaultValueFormatter}
                  textAnchor="end"
                  yAxisLabel={Boolean(yAxisLeft?.label)}
                />
              )}
              tickFormatter={yAxisLeft?.valueFormatter ?? defaultValueFormatter}
              tickLine={false}
              type="number"
              width={leftYAxisWidth}
              yAxisId="left"
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
                fill=""
                hide={!showYAxis}
                orientation="right"
                stroke=""
                tick={(tickProps) => (
                  <CustomYAxisTick
                    {...tickProps}
                    align="right"
                    formatter={yAxisRight?.valueFormatter ?? defaultValueFormatter}
                    textAnchor="start"
                    yAxisLabel={Boolean(yAxisRight?.label)}
                  />
                )}
                tickFormatter={yAxisRight?.valueFormatter ?? defaultValueFormatter}
                tickLine={false}
                type="number"
                width={rightYAxisWidth}
                yAxisId="right"
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

            <Tooltip
              content={
                showTooltip
                  ? ({ active, payload, label }) => (
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
                    )
                  : undefined
              }
              cursor={{ fill: cssVar.colorFillTertiary }}
              isAnimationActive={false}
              position={{ y: 0 }}
              wrapperStyle={{ outline: 'none' }}
            />

            {showLegend && (
              <Legend
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
                height={legendHeight}
                verticalAlign="top"
              />
            )}

            {series.map((s) => {
              const color = seriesColorMap.get(s.key) ?? cssVar.colorPrimary;
              const axisId = s.axis ?? 'left';

              if (s.type === 'bar') {
                return (
                  <Bar
                    animationDuration={animationDuration}
                    className={cx(css`
                      fill: ${color};
                    `)}
                    dataKey={s.key}
                    fill=""
                    isAnimationActive={showAnimation}
                    key={s.key}
                    name={s.key}
                    yAxisId={axisId}
                  />
                );
              }

              if (s.type === 'line') {
                return (
                  <Line
                    animationDuration={animationDuration}
                    className={cx(css`
                      stroke: ${color};
                    `)}
                    dataKey={s.key}
                    dot={false}
                    isAnimationActive={showAnimation}
                    key={s.key}
                    name={s.key}
                    stroke=""
                    strokeWidth={2}
                    type="monotone"
                    yAxisId={axisId}
                  />
                );
              }

              return null;
            })}
          </ReChartsComposedChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
});

ComposedChart.displayName = 'ComposedChart';

export default ComposedChart;
