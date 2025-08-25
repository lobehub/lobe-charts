'use client';

import { Skeleton } from 'antd';
import { css } from 'antd-style';
import { readableColor } from 'polished';
import { MouseEvent, forwardRef, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import {
  Bar,
  CartesianGrid,
  ErrorBar,
  Label,
  LabelList,
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
import CustomYAxisTick from '@/common/CustomYAxisTick';
import NoData from '@/common/NoData';
import { constructCategoryColors, deepEqual, getYAxisDomain } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { defaultValueFormatter } from '@/utils';
import { getMaxLabelLength } from '@/utils/getMaxLabelLength';

import { useStyles } from './styles';

export interface AccuracyBarChartProps extends Omit<BaseChartProps, 'categories'> {
  /**
   * Custom accuracy formatter
   */
  accuracyFormatter?: (value: number) => string;
  /**
   * Gap between bar categories
   */
  barCategoryGap?: string | number;
  /**
   * Single data category key (e.g., 'accuracy')
   * @default 'accuracy'
   */
  category?: string;
  /**
   * Color scheme for accuracy levels
   * @default 'gradient'
   */
  colorScheme?: 'gradient' | 'threshold' | 'uniform';
  /**
   * Error value formatter used in tooltip when displaying value±error
   */
  errorFormatter?: (value: number) => string;
  /**
   * Error bar data key (e.g., 'error', 'stdDev')
   */
  errorKey?: string;
  /**
   * Chart layout orientation
   * @default 'vertical'
   */
  layout?: 'vertical' | 'horizontal';
  /**
   * Show error bars on the right side
   * @default true
   */
  showErrorBars?: boolean;
  /**
   * Show accuracy value on the left side
   * @default true
   */
  showLeftValue?: boolean;
  /**
   * Show accuracy percentage on bars
   * @default true
   */
  showPercentage?: boolean;
  /**
   * Threshold values for color coding (only used with 'threshold' colorScheme)
   */
  thresholds?: {
    excellent?: number;
    // >= this value
    fair?: number;
    // >= this value
    good?: number; // >= this value
    // below fair is considered poor
  };
}

const AccuracyBarChart = forwardRef<HTMLDivElement, AccuracyBarChartProps>((props, ref) => {
  const { cx, theme, styles } = useStyles();
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    category = 'accuracy',
    customCategories,
    index,
    yAxisAlign = 'left',
    colors = themeColorRange,
    valueFormatter = defaultValueFormatter,
    xAxisLabelFormatter = defaultValueFormatter,
    layout = 'vertical', // Default to vertical for leaderboard-style display
    startEndOnly = false,
    animationDuration = 900,
    showAnimation = false,
    showXAxis = true,
    showYAxis = true,
    yAxisWidth,
    intervalType = 'equidistantPreserveStart',
    showTooltip = true,
    showLegend = false, // Default to false for accuracy charts
    showGridLines = true,
    autoMinValue = true, // Default to true for percentage data
    minValue = 0,
    maxValue = 100, // Default max for percentage
    allowDecimals = true,
    noDataText,
    onValueChange,
    enableLegendSlider = false,
    showPercentage = true,
    customTooltip,
    rotateLabelX,
    barCategoryGap = '20%',
    tickGap = 5,
    loading,
    xAxisLabel,
    yAxisLabel,
    className,
    width = '100%',
    height = 400, // Taller default for vertical layout
    style,
    showErrorBars = true,
    errorFormatter = (value: number) => value.toFixed(1),
    errorKey = 'error',
    accuracyFormatter = (value: number) => `${value.toFixed(1)}%`,
    ...rest
  } = props;

  const [activeBar, setActiveBar] = useState<any | undefined>();
  const [activeLegend, setActiveLegend] = useState<string | undefined>();
  const [legendHeight, setLegendHeight] = useState(60);

  const calculatedYAxisWidth: number | string = useMemo(() => {
    if (yAxisWidth) return yAxisWidth;
    return getMaxLabelLength({ data, index, layout, valueFormatter: xAxisLabelFormatter });
  }, [yAxisWidth, layout, data, xAxisLabelFormatter, index]);

  if (loading || !data) return <Skeleton.Button active block style={{ height, width }} />;

  const CustomTooltip = customTooltip;
  const paddingValue = !showXAxis && !showYAxis ? 0 : 20;
  const categoryColors = constructCategoryColors([category], colors);
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

  // Custom accuracy formatter for display
  const displayFormatter = accuracyFormatter || valueFormatter;

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
              right: showErrorBars && layout === 'vertical' ? 40 : yAxisLabel ? 5 : undefined,
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
                hide={!showXAxis}
                minTickGap={tickGap}
                stroke=""
                tick={{ transform: 'translate(-3, 0)' }}
                tickFormatter={displayFormatter}
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
                hide={!showXAxis}
                interval={startEndOnly ? 'preserveStartEnd' : intervalType}
                minTickGap={tickGap}
                padding={{ left: paddingValue, right: paddingValue }}
                stroke=""
                tick={{ transform: 'translate(0, 6)' }}
                tickFormatter={xAxisLabelFormatter}
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
                tick={(props) => (
                  <CustomYAxisTick
                    {...props}
                    align={yAxisAlign}
                    formatter={xAxisLabelFormatter}
                    textAnchor={yAxisAlign === 'left' ? 'start' : 'end'}
                    yAxisLabel={Boolean(yAxisLabel)}
                  />
                )}
                tickFormatter={xAxisLabelFormatter}
                tickLine={false}
                ticks={startEndOnly ? [data[0][index], data.at(-1)[index]] : undefined}
                type="category"
                width={calculatedYAxisWidth}
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
                tick={(props) => (
                  <CustomYAxisTick
                    {...props}
                    align={yAxisAlign}
                    formatter={displayFormatter}
                    textAnchor={yAxisAlign === 'left' ? 'start' : 'end'}
                    yAxisLabel={Boolean(yAxisLabel)}
                  />
                )}
                tickFormatter={displayFormatter}
                tickLine={false}
                type="number"
                width={calculatedYAxisWidth}
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
                          customCategories={customCategories}
                          label={label}
                          payload={payload?.map((payloadItem: any) => {
                            const record = data.find((item) => item[index] === label);
                            const errVal = record?.[errorKey];
                            const combined =
                              errVal === undefined || errVal === null
                                ? accuracyFormatter(Number(payloadItem.value))
                                : `${accuracyFormatter(Number(payloadItem.value))} ± ${errorFormatter(Number(errVal))}`;
                            return {
                              ...payloadItem,
                              formattedValue: combined,
                            };
                          })}
                          valueFormatter={displayFormatter}
                        />
                      ) : (
                        <ChartTooltip
                          active={active}
                          categoryColors={categoryColors}
                          customCategories={customCategories}
                          label={label}
                          payload={payload}
                          valueFormatter={(val: number): any => {
                            const record = data.find((item) => item[index] === label);
                            const errVal = record?.[errorKey];
                            if (!showErrorBars || errVal === undefined || errVal === null)
                              return accuracyFormatter(Number(val));
                            return (
                              <>
                                {accuracyFormatter(Number(val))}
                                <span style={{ color: theme.colorTextSecondary }}>
                                  {' '}
                                  ± ${errorFormatter(Number(errVal))}
                                </span>
                              </>
                            );
                          }}
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
                    customCategories,
                  )
                }
                height={legendHeight}
                verticalAlign="top"
              />
            ) : undefined}
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
              style={{
                cursor: onValueChange ? 'pointer' : undefined,
              }}
              type="linear"
            >
              {showPercentage && layout === 'vertical' ? (
                <LabelList
                  content={(labelProps: any) => {
                    const { x: lx, y: ly, height: lh, value } = labelProps;
                    if (
                      lx === null ||
                      lx === undefined ||
                      ly === null ||
                      ly === undefined ||
                      lh === null ||
                      lh === undefined
                    )
                      return null;
                    return (
                      <text
                        className={styles.percentageLabel}
                        dominantBaseline="central"
                        style={{
                          fill: readableColor(categoryColors.get(category) ?? theme.colorPrimary),
                        }}
                        x={Number(lx) + 8}
                        y={Number(ly) + Number(lh) / 2}
                      >
                        {accuracyFormatter(Number(value ?? 0))}
                      </text>
                    );
                  }}
                  dataKey={category}
                  offset={8}
                  position="insideLeft"
                />
              ) : null}
              {showErrorBars ? (
                <ErrorBar dataKey={errorKey} direction="x" stroke={theme.colorTextSecondary} />
              ) : null}
            </Bar>
          </ReChartsBarChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </Flexbox>
  );
});

AccuracyBarChart.displayName = 'AccuracyBarChart';

export default AccuracyBarChart;
