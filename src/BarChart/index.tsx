'use client';

import { css } from 'antd-style';
import { MouseEvent, forwardRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import {
  Bar,
  CartesianGrid,
  Label,
  Legend,
  BarChart as ReChartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

import BaseChartProps from '@/common/BaseChartProps';
import ChartLegend from '@/common/ChartLegend';
import ChartTooltip from '@/common/ChartTooltip';
import NoData from '@/common/NoData';
import { constructCategoryColors, deepEqual, getYAxisDomain } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { defaultValueFormatter } from '@/utils';

import { renderShape } from './renderShape';
import { useStyles } from './styles';

export interface BarChartProps extends BaseChartProps {
  barCategoryGap?: string | number;
  layout?: 'vertical' | 'horizontal';
  relative?: boolean;
  stack?: boolean;
}

const BarChart = forwardRef<HTMLDivElement, BarChartProps>((props, ref) => {
  const { cx, theme, styles } = useStyles();
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    categories = [],
    index,
    colors = themeColorRange,
    valueFormatter = defaultValueFormatter,
    layout = 'horizontal',
    stack = false,
    relative = false,
    startEndOnly = false,
    animationDuration = 900,
    showAnimation = false,
    showXAxis = true,
    showYAxis = true,
    yAxisWidth = 56,
    intervalType = 'equidistantPreserveStart',
    showTooltip = true,
    showLegend = true,
    showGridLines = true,
    autoMinValue = false,
    minValue,
    maxValue,
    allowDecimals = true,
    noDataText,
    onValueChange,
    enableLegendSlider = false,
    customTooltip,
    rotateLabelX,
    barCategoryGap,
    tickGap = 5,
    xAxisLabel,
    yAxisLabel,
    className,
    width = '100%',
    height = '20rem',
    style,
    ...rest
  } = props;
  const CustomTooltip = customTooltip;
  const paddingValue = !showXAxis && !showYAxis ? 0 : 20;
  const [legendHeight, setLegendHeight] = useState(60);
  const categoryColors = constructCategoryColors(categories, colors);
  const [activeBar, setActiveBar] = useState<any | undefined>();
  const [activeLegend, setActiveLegend] = useState<string | undefined>();
  const hasOnValueChange = !!onValueChange;

  const onBarClick = (data: any, idx: number, event: MouseEvent) => {
    event.stopPropagation();
    if (!onValueChange) return;
    if (deepEqual(activeBar, { ...data.payload, value: data.value })) {
      setActiveLegend(undefined);
      setActiveBar(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(data.tooltipPayload?.[0]?.dataKey);
      setActiveBar({
        ...data.payload,
        value: data.value,
      });
      onValueChange?.({
        categoryClicked: data.tooltipPayload?.[0]?.dataKey,
        eventType: 'bar',
        ...data.payload,
      });
    }
  };

  const onCategoryClick = (dataKey: string) => {
    if (!hasOnValueChange) return;
    if (dataKey === activeLegend && !activeBar) {
      setActiveLegend(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(dataKey);
      onValueChange?.({
        categoryClicked: dataKey,
        eventType: 'category',
      });
    }
    setActiveBar(undefined);
  };

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
            barCategoryGap={barCategoryGap}
            data={data}
            layout={layout === 'vertical' ? 'vertical' : 'horizontal'}
            margin={{
              bottom: xAxisLabel ? 30 : undefined,
              left: yAxisLabel ? 20 : undefined,
              right: yAxisLabel ? 5 : undefined,
              top: 5,
            }}
            onClick={
              hasOnValueChange && (activeLegend || activeBar)
                ? () => {
                    setActiveBar(undefined);
                    setActiveLegend(undefined);
                    onValueChange?.(null);
                  }
                : undefined
            }
            stackOffset={stack ? 'sign' : relative ? 'expand' : 'none'}
          >
            {showGridLines ? (
              <CartesianGrid
                className={styles.gridLines}
                horizontal={layout !== 'vertical'}
                vertical={layout === 'vertical'}
              />
            ) : undefined}

            {layout === 'vertical' ? (
              <XAxis
                allowDecimals={allowDecimals}
                angle={rotateLabelX?.angle}
                axisLine={false}
                className={styles.label}
                domain={yAxisDomain as AxisDomain}
                dy={rotateLabelX?.verticalShift}
                fill=""
                height={rotateLabelX?.xAxisHeight}
                hide={!showXAxis}
                minTickGap={tickGap}
                stroke=""
                tick={{ transform: 'translate(-3, 0)' }}
                tickFormatter={valueFormatter}
                tickLine={false}
                type="number"
              >
                {xAxisLabel && (
                  <Label
                    className={cx(styles.strongLabel, styles.emphasis)}
                    offset={-20}
                    position="insideBottom"
                    style={{
                      fill: theme.colorTextSecondary,
                      fontWeight: 500,
                      textAnchor: 'middle',
                    }}
                  >
                    {xAxisLabel}
                  </Label>
                )}
              </XAxis>
            ) : (
              <XAxis
                angle={rotateLabelX?.angle}
                axisLine={false}
                className={styles.label}
                dataKey={index}
                dy={rotateLabelX?.verticalShift}
                fill=""
                height={rotateLabelX?.xAxisHeight}
                hide={!showXAxis}
                interval={startEndOnly ? 'preserveStartEnd' : intervalType}
                minTickGap={tickGap}
                padding={{ left: paddingValue, right: paddingValue }}
                stroke=""
                tick={{ transform: 'translate(0, 6)' }}
                tickLine={false}
                ticks={startEndOnly ? [data[0][index], data.at(-1)[index]] : undefined}
              >
                {xAxisLabel && (
                  <Label
                    className={cx(styles.strongLabel, styles.emphasis)}
                    offset={-20}
                    position="insideBottom"
                    style={{
                      fill: theme.colorTextSecondary,
                      fontWeight: 500,
                      textAnchor: 'middle',
                    }}
                  >
                    {xAxisLabel}
                  </Label>
                )}
              </XAxis>
            )}
            {layout === 'vertical' ? (
              <YAxis
                axisLine={false}
                className={styles.label}
                dataKey={index}
                fill=""
                hide={!showYAxis}
                interval="preserveStartEnd"
                stroke=""
                tick={{ transform: 'translate(0, 6)' }}
                tickLine={false}
                ticks={startEndOnly ? [data[0][index], data.at(-1)[index]] : undefined}
                type="category"
                width={yAxisWidth}
              >
                {yAxisLabel && (
                  <Label
                    angle={-90}
                    className={styles.emphasis}
                    offset={-15}
                    position="insideLeft"
                    style={{
                      fill: theme.colorTextSecondary,
                      fontWeight: 500,
                      textAnchor: 'middle',
                    }}
                  >
                    {yAxisLabel}
                  </Label>
                )}
              </YAxis>
            ) : (
              <YAxis
                allowDecimals={allowDecimals}
                axisLine={false}
                className={styles.label}
                domain={yAxisDomain as AxisDomain}
                fill=""
                hide={!showYAxis}
                stroke=""
                tick={{ transform: 'translate(-3, 0)' }}
                tickFormatter={
                  relative ? (value: number) => `${(value * 100).toString()} %` : valueFormatter
                }
                tickLine={false}
                type="number"
                width={yAxisWidth}
              >
                {yAxisLabel && (
                  <Label
                    angle={-90}
                    className={styles.emphasis}
                    offset={-15}
                    position="insideLeft"
                    style={{
                      fill: theme.colorTextSecondary,
                      fontWeight: 500,
                      textAnchor: 'middle',
                    }}
                  >
                    {yAxisLabel}
                  </Label>
                )}
              </YAxis>
            )}
            <Tooltip
              content={
                showTooltip
                  ? ({ active, payload, label }) =>
                      CustomTooltip ? (
                        <CustomTooltip
                          active={active}
                          label={label}
                          payload={payload?.map((payloadItem: any) => ({
                            ...payloadItem,
                            color: categoryColors.get(payloadItem.dataKey) ?? theme.colorPrimary,
                          }))}
                        />
                      ) : (
                        <ChartTooltip
                          active={active}
                          categoryColors={categoryColors}
                          label={label}
                          payload={payload}
                          valueFormatter={valueFormatter}
                        />
                      )
                  : undefined
              }
              cursor={{ fill: theme.colorFillTertiary }}
              isAnimationActive={false}
              position={{ y: 0 }}
              wrapperStyle={{ outline: 'none' }}
            />
            {showLegend ? (
              <Legend
                content={({ payload }) =>
                  ChartLegend(
                    { payload },
                    categoryColors,
                    setLegendHeight,
                    activeLegend,
                    hasOnValueChange
                      ? (clickedLegendItem: string) => onCategoryClick(clickedLegendItem)
                      : undefined,
                    enableLegendSlider,
                  )
                }
                height={legendHeight}
                verticalAlign="top"
              />
            ) : undefined}
            {categories.map((category) => {
              return (
                <Bar
                  animationDuration={animationDuration}
                  className={cx(css`
                    fill: ${categoryColors.get(category) ?? theme.colorPrimary};
                  `)}
                  dataKey={category}
                  fill={''}
                  isAnimationActive={showAnimation}
                  key={category}
                  name={category}
                  onClick={onBarClick}
                  shape={(props: any) => renderShape(props, activeBar, activeLegend, layout)}
                  stackId={stack || relative ? 'a' : undefined}
                  style={{
                    cursor: onValueChange ? 'pointer' : undefined,
                  }}
                  type="linear"
                />
              );
            })}
          </ReChartsBarChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
});

BarChart.displayName = 'BarChart';

export default BarChart;
