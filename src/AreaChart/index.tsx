'use client';

import { css } from 'antd-style';
import { Fragment, MouseEvent, forwardRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import {
  Area,
  CartesianGrid,
  Dot,
  Label,
  Legend,
  Line,
  AreaChart as ReChartsAreaChart,
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
import { constructCategoryColors, getYAxisDomain, hasOnlyOneValueForThisKey } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { CurveType } from '@/types';
import { defaultValueFormatter } from '@/utils';

import { useStyles } from './styles';

export interface AreaChartProps extends BaseChartProps {
  connectNulls?: boolean;
  curveType?: CurveType;
  showGradient?: boolean;
  stack?: boolean;
}

interface ActiveDot {
  dataKey?: string;
  index?: number;
}

const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>((props, ref) => {
  const { cx, theme, styles } = useStyles();
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    categories = [],
    index,
    stack = false,
    colors = themeColorRange,
    valueFormatter = defaultValueFormatter,
    startEndOnly = false,
    showXAxis = true,
    showYAxis = true,
    yAxisWidth = 56,
    intervalType = 'equidistantPreserveStart',
    showAnimation = false,
    animationDuration = 900,
    showTooltip = true,
    showLegend = true,
    showGridLines = true,
    showGradient = true,
    autoMinValue = false,
    curveType = 'linear',
    minValue,
    maxValue,
    connectNulls = false,
    allowDecimals = true,
    noDataText,
    className,
    onValueChange,
    enableLegendSlider = false,
    customTooltip,
    rotateLabelX,
    tickGap = 5,
    xAxisLabel,
    yAxisLabel,
    width = '100%',
    height = '20rem',
    style,
    ...rest
  } = props;
  const CustomTooltip = customTooltip;
  const paddingValue = (!showXAxis && !showYAxis) || (startEndOnly && !showYAxis) ? 0 : 20;
  const [legendHeight, setLegendHeight] = useState(60);
  const [activeDot, setActiveDot] = useState<ActiveDot | undefined>();
  const [activeLegend, setActiveLegend] = useState<string | undefined>();
  const categoryColors = constructCategoryColors(categories, colors);

  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);
  const hasOnValueChange = !!onValueChange;

  const onDotClick = (itemData: any, event: MouseEvent) => {
    event.stopPropagation();

    if (!hasOnValueChange) return;
    if (
      (itemData.index === activeDot?.index && itemData.dataKey === activeDot?.dataKey) ||
      (hasOnlyOneValueForThisKey(data, itemData.dataKey) &&
        activeLegend &&
        activeLegend === itemData.dataKey)
    ) {
      setActiveLegend(undefined);
      setActiveDot(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(itemData.dataKey);
      setActiveDot({
        dataKey: itemData.dataKey,
        index: itemData.index,
      });
      onValueChange?.({
        categoryClicked: itemData.dataKey,
        eventType: 'dot',
        ...itemData.payload,
      });
    }
  };

  const onCategoryClick = (dataKey: string) => {
    if (!hasOnValueChange) return;
    if (
      (dataKey === activeLegend && !activeDot) ||
      (hasOnlyOneValueForThisKey(data, dataKey) && activeDot && activeDot.dataKey === dataKey)
    ) {
      setActiveLegend(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(dataKey);
      onValueChange?.({
        categoryClicked: dataKey,
        eventType: 'category',
      });
    }
    setActiveDot(undefined);
  };
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
          <ReChartsAreaChart
            data={data}
            margin={{
              bottom: xAxisLabel ? 30 : undefined,
              left: yAxisLabel ? 20 : undefined,
              right: yAxisLabel ? 5 : undefined,
              top: 5,
            }}
            onClick={
              hasOnValueChange && (activeLegend || activeDot)
                ? () => {
                    setActiveDot(undefined);
                    setActiveLegend(undefined);
                    onValueChange?.(null);
                  }
                : undefined
            }
          >
            {showGridLines ? (
              <CartesianGrid className={styles.gridLines} horizontal={true} vertical={false} />
            ) : undefined}
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
                >
                  {xAxisLabel}
                </Label>
              )}
            </XAxis>
            <YAxis
              allowDecimals={allowDecimals}
              axisLine={false}
              className={styles.label}
              domain={yAxisDomain as AxisDomain}
              fill=""
              hide={!showYAxis}
              stroke=""
              tick={{ transform: 'translate(-3, 0)' }}
              tickFormatter={valueFormatter}
              tickLine={false}
              type="number"
              width={yAxisWidth}
            >
              {yAxisLabel && (
                <Label
                  angle={-90}
                  className={cx(styles.strongLabel, styles.emphasis)}
                  offset={-15}
                  position="insideLeft"
                  style={{ textAnchor: 'middle' }}
                >
                  {yAxisLabel}
                </Label>
              )}
            </YAxis>
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
              cursor={{ stroke: theme.colorTextSecondary, strokeWidth: 1 }}
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
                <defs key={category}>
                  {showGradient ? (
                    <linearGradient
                      className={cx(css`
                        color: ${categoryColors.get(category) ?? theme.colorPrimary};
                      `)}
                      id={categoryColors.get(category)}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="currentColor"
                        stopOpacity={
                          activeDot || (activeLegend && activeLegend !== category) ? 0.15 : 0.4
                        }
                      />
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  ) : (
                    <linearGradient
                      className={cx(css`
                        color: ${categoryColors.get(category) ?? theme.colorPrimary};
                      `)}
                      id={categoryColors.get(category)}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        stopColor="currentColor"
                        stopOpacity={
                          activeDot || (activeLegend && activeLegend !== category) ? 0.1 : 0.3
                        }
                      />
                    </linearGradient>
                  )}
                </defs>
              );
            })}
            {categories.map((category) => (
              <Area
                activeDot={(props: any) => {
                  const {
                    cx: dotCx,
                    cy: dotCy,
                    stroke,
                    strokeLinecap,
                    strokeLinejoin,
                    strokeWidth,
                    dataKey,
                  } = props;
                  return (
                    <Dot
                      className={cx(css`
                        fill: ${categoryColors.get(dataKey) ?? theme.colorPrimary};
                      `)}
                      cx={dotCx}
                      cy={dotCy}
                      fill=""
                      onClick={(dotProps: any, event) => onDotClick(props, event)}
                      r={5}
                      stroke={stroke}
                      strokeLinecap={strokeLinecap}
                      strokeLinejoin={strokeLinejoin}
                      strokeWidth={strokeWidth}
                    />
                  );
                }}
                animationDuration={animationDuration}
                className={cx(css`
                  stroke: ${categoryColors.get(category) ?? theme.colorPrimary};
                `)}
                connectNulls={connectNulls}
                dataKey={category}
                dot={(props: any) => {
                  const {
                    stroke,
                    strokeLinecap,
                    strokeLinejoin,
                    strokeWidth,
                    cx: dotCx,
                    cy: dotCy,
                    dataKey,
                    index,
                  } = props;

                  if (
                    (hasOnlyOneValueForThisKey(data, category) &&
                      !(activeDot || (activeLegend && activeLegend !== category))) ||
                    (activeDot?.index === index && activeDot?.dataKey === category)
                  ) {
                    return (
                      <Dot
                        className={cx(css`
                          fill: ${categoryColors.get(dataKey) ?? theme.colorPrimary};
                        `)}
                        cx={dotCx}
                        cy={dotCy}
                        fill=""
                        key={index}
                        r={5}
                        stroke={stroke}
                        strokeLinecap={strokeLinecap}
                        strokeLinejoin={strokeLinejoin}
                        strokeWidth={strokeWidth}
                        style={{
                          cursor: onValueChange ? 'pointer' : undefined,
                        }}
                      />
                    );
                  }
                  return <Fragment key={index}></Fragment>;
                }}
                fill={`url(#${categoryColors.get(category)})`}
                isAnimationActive={showAnimation}
                key={category}
                name={category}
                stackId={stack ? 'a' : undefined}
                stroke=""
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={activeDot || (activeLegend && activeLegend !== category) ? 0.3 : 1}
                strokeWidth={2}
                type={curveType}
              />
            ))}
            {onValueChange
              ? categories.map((category) => (
                  <Line
                    connectNulls={connectNulls}
                    dataKey={category}
                    fill="transparent"
                    key={category}
                    legendType="none"
                    name={category}
                    onClick={(props: any, event) => {
                      event.stopPropagation();
                      const { name } = props;
                      onCategoryClick(name);
                    }}
                    stroke="transparent"
                    strokeOpacity={0}
                    strokeWidth={12}
                    style={{
                      cursor: 'pointer',
                    }}
                    tooltipType="none"
                    type={curveType}
                  />
                ))
              : undefined}
          </ReChartsAreaChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
});

AreaChart.displayName = 'AreaChart';

export default AreaChart;
