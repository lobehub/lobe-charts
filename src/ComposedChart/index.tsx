'use client';

import { Flexbox, Skeleton } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStaticStyles, css, cssVar, cx } from 'antd-style';
import { Fragment, MouseEvent, forwardRef, useMemo, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Dot,
  Label,
  Legend,
  Line,
  ComposedChart as ReChartsComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

import BaseChartProps from '@/common/BaseChartProps';
import ChartLegend from '@/common/ChartLegend';
import ChartTooltipFrame from '@/common/ChartTooltip/ChartTooltipFrame';
import ChartTooltipRow from '@/common/ChartTooltip/ChartTooltipRow';
import CustomYAxisTick from '@/common/CustomYAxisTick';
import NoData from '@/common/NoData';
import { deepEqual, getYAxisDomain, hasOnlyOneValueForThisKey } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { CurveType, ValueFormatter } from '@/types/charts';
import { defaultValueFormatter } from '@/utils';
import { getTextWidth } from '@/utils/getMaxLabelLength';

import { styles } from './styles';

// ---------- Types ----------

export interface ComposedChartSeries {
  /** Which y axis this series belongs to. Defaults to 'left'. */
  axis?: 'left' | 'right';
  /** Explicit color. Falls back to the theme color range when omitted. */
  color?: string;
  /** For line series only — connect gaps across null values. */
  connectNulls?: boolean;
  /** For line series only — curve interpolation. */
  curveType?: CurveType;
  /** The data key in each row object. */
  key: string;
  /** Display label used in legend and tooltip. Defaults to key. */
  label?: string;
  /** Series type rendered on the chart. */
  type: 'bar' | 'line';
}

export interface ComposedChartYAxisConfig {
  allowDecimals?: boolean;
  autoMinValue?: boolean;
  label?: string;
  maxValue?: number;
  minValue?: number;
  valueFormatter?: ValueFormatter;
  width?: number;
}

export interface ComposedChartProps extends Omit<
  BaseChartProps,
  'categories' | 'colors' | 'valueFormatter' | 'yAxisAlign' | 'yAxisWidth' | 'yAxisLabel'
> {
  barCategoryGap?: string | number;
  /** Default connectNulls for all line series (can be overridden per-series). */
  connectNulls?: boolean;
  /** Default curve type for all line series (can be overridden per-series). */
  curveType?: CurveType;
  series: ComposedChartSeries[];
  /** Stack all bar series. */
  stackBars?: boolean;
  yAxisLeft?: ComposedChartYAxisConfig;
  yAxisRight?: ComposedChartYAxisConfig;
}

interface ActiveDot {
  dataKey?: string;
  index?: number;
}

// ---------- Tooltip ----------

const tooltipHeaderStyles = createStaticStyles(({ css, cssVar }) => ({
  header: css`
    border-bottom: 1px solid ${cssVar.colorBorderSecondary};
    font-weight: 500;
  `,
}));

interface ComposedChartTooltipProps {
  active: boolean | undefined;
  categoryColors: Map<string, string>;
  customCategories?: { [key: string]: string };
  label: string;
  payload: any;
  valueFormatters: Map<string, ValueFormatter>;
}

const ComposedChartTooltip = ({
  active,
  payload,
  label,
  categoryColors,
  valueFormatters,
  customCategories,
}: ComposedChartTooltipProps) => {
  if (!active || !payload) return null;
  const filteredPayload = payload.filter((item: any) => item.type !== 'none');
  return (
    <ChartTooltipFrame>
      <Flexbox className={cx(tooltipHeaderStyles.header)} paddingBlock={8} paddingInline={16}>
        <Typography.Paragraph ellipsis style={{ margin: 0 }}>
          {label}
        </Typography.Paragraph>
      </Flexbox>
      <Flexbox
        gap={4}
        paddingBlock={8}
        paddingInline={16}
        style={{ flexDirection: 'column-reverse', marginTop: 4 }}
      >
        {filteredPayload.map(({ value, name }: { name: string; value: number }, idx: number) => {
          const formatter = valueFormatters.get(name) ?? defaultValueFormatter;
          return (
            <ChartTooltipRow
              color={categoryColors.get(name) ?? cssVar.colorPrimary}
              key={`id-${idx}`}
              name={customCategories?.[name] ?? name}
              value={formatter(value)}
            />
          );
        })}
      </Flexbox>
    </ChartTooltipFrame>
  );
};

// ---------- Helper ----------

const getAxisWidth = (
  data: any[],
  keys: string[],
  formatter: ValueFormatter,
  margin = 24,
): number => {
  let maxLabel = '';
  for (const item of data) {
    for (const key of keys) {
      const value = item[key];
      if (value === undefined) continue;
      const formatted = formatter(value);
      if (formatted.length > maxLabel.length) maxLabel = formatted;
    }
  }
  return getTextWidth(maxLabel) + margin;
};

// ---------- Component ----------

const ComposedChart = forwardRef<HTMLDivElement, ComposedChartProps>((props, ref) => {
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    series = [],
    index,
    startEndOnly = false,
    animationDuration = 900,
    showAnimation = false,
    showXAxis = true,
    showYAxis = true,
    intervalType = 'equidistantPreserveStart',
    showTooltip = true,
    showLegend = true,
    showGridLines = true,
    noDataText,
    onValueChange,
    enableLegendSlider = false,
    customTooltip,
    rotateLabelX,
    barCategoryGap,
    tickGap = 5,
    loading,
    xAxisLabel,
    xAxisLabelFormatter = defaultValueFormatter,
    curveType = 'linear',
    connectNulls = false,
    stackBars = false,
    yAxisLeft = {},
    yAxisRight = {},
    className,
    width = '100%',
    height = 280,
    style,
    customCategories: customCategoriesProp,
    ...rest
  } = props;

  const [activeBar, setActiveBar] = useState<any | undefined>();
  const [activeDot, setActiveDot] = useState<ActiveDot | undefined>();
  const [activeLegend, setActiveLegend] = useState<string | undefined>();
  const [legendHeight, setLegendHeight] = useState(60);

  // Build categoryColors from series, consuming theme colors for ones without an explicit color.
  const categoryColors = useMemo<Map<string, string>>(() => {
    const map = new Map<string, string>();
    let themeIdx = 0;
    for (const s of series) {
      if (s.color) {
        map.set(s.key, s.color);
      } else {
        map.set(s.key, themeColorRange[themeIdx % themeColorRange.length]);
        themeIdx++;
      }
    }
    return map;
  }, [series, themeColorRange]);

  // Merge per-series label overrides with any user-supplied customCategories.
  const customCategories = useMemo<{ [key: string]: string } | undefined>(() => {
    const merged: { [key: string]: string } = { ...customCategoriesProp };
    for (const s of series) {
      if (s.label && !merged[s.key]) merged[s.key] = s.label;
    }
    return Object.keys(merged).length > 0 ? merged : undefined;
  }, [series, customCategoriesProp]);

  // Per-series value formatters for the tooltip.
  const valueFormatters = useMemo<Map<string, ValueFormatter>>(() => {
    const map = new Map<string, ValueFormatter>();
    for (const s of series) {
      map.set(
        s.key,
        s.axis === 'right'
          ? (yAxisRight.valueFormatter ?? defaultValueFormatter)
          : (yAxisLeft.valueFormatter ?? defaultValueFormatter),
      );
    }
    return map;
  }, [series, yAxisLeft.valueFormatter, yAxisRight.valueFormatter]);

  const leftSeries = useMemo(() => series.filter((s) => s.axis !== 'right'), [series]);
  const rightSeries = useMemo(() => series.filter((s) => s.axis === 'right'), [series]);
  const hasRightAxis = rightSeries.length > 0;

  const leftFormatter = yAxisLeft.valueFormatter ?? defaultValueFormatter;
  const rightFormatter = yAxisRight.valueFormatter ?? defaultValueFormatter;

  const calculatedLeftWidth = useMemo(
    () =>
      yAxisLeft.width ??
      getAxisWidth(
        data,
        leftSeries.map((s) => s.key),
        leftFormatter,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [yAxisLeft.width, data, leftSeries, leftFormatter],
  );

  const calculatedRightWidth = useMemo(
    () =>
      hasRightAxis
        ? (yAxisRight.width ??
          getAxisWidth(
            data,
            rightSeries.map((s) => s.key),
            rightFormatter,
          ))
        : 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [yAxisRight.width, data, rightSeries, rightFormatter, hasRightAxis],
  );

  if (loading || !data) return <Skeleton.Block active height={height} width={width} />;

  const CustomTooltip = customTooltip;
  const paddingValue = !showXAxis && !showYAxis ? 0 : 20;
  const hasOnValueChange = !!onValueChange;

  const leftDomain = getYAxisDomain(
    yAxisLeft.autoMinValue ?? false,
    yAxisLeft.minValue,
    yAxisLeft.maxValue,
  );
  const rightDomain = getYAxisDomain(
    yAxisRight.autoMinValue ?? false,
    yAxisRight.minValue,
    yAxisRight.maxValue,
  );

  // ---------- Event handlers ----------

  const onBarClick = (barData: any, _idx: number, event: MouseEvent) => {
    event.stopPropagation();
    if (!onValueChange) return;
    if (deepEqual(activeBar, { ...barData.payload, value: barData.value })) {
      setActiveLegend(undefined);
      setActiveBar(undefined);
      onValueChange(null);
    } else {
      setActiveLegend(barData.tooltipPayload?.[0]?.dataKey);
      setActiveBar({ ...barData.payload, value: barData.value });
      onValueChange({
        categoryClicked: barData.tooltipPayload?.[0]?.dataKey,
        eventType: 'bar',
        ...barData.payload,
      });
    }
  };

  const onDotClick = (dotData: any, event: MouseEvent) => {
    event.stopPropagation();
    if (!hasOnValueChange) return;
    if (
      (dotData.index === activeDot?.index && dotData.dataKey === activeDot?.dataKey) ||
      (hasOnlyOneValueForThisKey(data, dotData.dataKey) &&
        activeLegend &&
        activeLegend === dotData.dataKey)
    ) {
      setActiveLegend(undefined);
      setActiveDot(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(dotData.dataKey);
      setActiveDot({ dataKey: dotData.dataKey, index: dotData.index });
      onValueChange?.({
        categoryClicked: dotData.dataKey,
        eventType: 'dot',
        ...dotData.payload,
      });
    }
  };

  const onCategoryClick = (dataKey: string) => {
    if (!hasOnValueChange) return;
    if (
      (dataKey === activeLegend && !activeDot && !activeBar) ||
      (hasOnlyOneValueForThisKey(data, dataKey) && activeDot && activeDot.dataKey === dataKey)
    ) {
      setActiveLegend(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(dataKey);
      onValueChange?.({ categoryClicked: dataKey, eventType: 'category' });
    }
    setActiveDot(undefined);
    setActiveBar(undefined);
  };

  // ---------- Render ----------

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
            barCategoryGap={barCategoryGap}
            data={data}
            margin={{
              bottom: xAxisLabel ? 30 : undefined,
              left: yAxisLeft.label ? 20 : undefined,
              right: hasRightAxis ? (yAxisRight.label ? 20 : 8) : 5,
              top: 5,
            }}
            onClick={
              hasOnValueChange && (activeLegend || activeBar || activeDot)
                ? () => {
                    setActiveBar(undefined);
                    setActiveDot(undefined);
                    setActiveLegend(undefined);
                    onValueChange?.(null);
                  }
                : undefined
            }
            stackOffset={stackBars ? 'sign' : 'none'}
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

            {/* Left Y-axis */}
            <YAxis
              allowDecimals={yAxisLeft.allowDecimals ?? true}
              axisLine={false}
              className={styles.label}
              domain={leftDomain as AxisDomain}
              fill=""
              hide={!showYAxis}
              orientation="left"
              stroke=""
              tick={(tickProps) => (
                <CustomYAxisTick
                  {...tickProps}
                  align="left"
                  formatter={leftFormatter}
                  textAnchor="start"
                  yAxisLabel={Boolean(yAxisLeft.label)}
                />
              )}
              tickFormatter={leftFormatter}
              tickLine={false}
              type="number"
              width={calculatedLeftWidth}
              yAxisId="left"
            >
              {yAxisLeft.label && (
                <Label
                  angle={-90}
                  className={cx(styles.strongLabel, styles.emphasis)}
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

            {/* Right Y-axis — only rendered when at least one series targets it */}
            {hasRightAxis && (
              <YAxis
                allowDecimals={yAxisRight.allowDecimals ?? true}
                axisLine={false}
                className={styles.label}
                domain={rightDomain as AxisDomain}
                fill=""
                hide={!showYAxis}
                orientation="right"
                stroke=""
                tick={({ x, y, payload }: any) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      dy={4}
                      fill={cssVar.colorTextDescription}
                      fontSize={12}
                      textAnchor="start"
                      x={4}
                      y={0}
                    >
                      {rightFormatter(payload.value)}
                    </text>
                  </g>
                )}
                tickLine={false}
                type="number"
                width={calculatedRightWidth}
                yAxisId="right"
              >
                {yAxisRight.label && (
                  <Label
                    angle={90}
                    className={cx(styles.strongLabel, styles.emphasis)}
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
                  ? ({ active, payload, label }) =>
                      CustomTooltip ? (
                        <CustomTooltip
                          active={active}
                          customCategories={customCategories}
                          label={label}
                          payload={payload?.map((payloadItem: any) => ({
                            ...payloadItem,
                            color: categoryColors.get(payloadItem.dataKey) ?? cssVar.colorPrimary,
                          }))}
                          valueFormatter={leftFormatter}
                        />
                      ) : (
                        <ComposedChartTooltip
                          active={active}
                          categoryColors={categoryColors}
                          customCategories={customCategories}
                          label={label}
                          payload={payload}
                          valueFormatters={valueFormatters}
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
            )}

            {/* Bar series */}
            {series
              .filter((s) => s.type === 'bar')
              .map((s) => (
                <Bar
                  animationDuration={animationDuration}
                  className={cx(css`
                    fill: ${categoryColors.get(s.key) ?? cssVar.colorPrimary};
                  `)}
                  dataKey={s.key}
                  fill=""
                  isAnimationActive={showAnimation}
                  key={s.key}
                  name={s.key}
                  onClick={onBarClick}
                  stackId={stackBars ? 'a' : undefined}
                  style={{ cursor: onValueChange ? 'pointer' : undefined }}
                  type="linear"
                  yAxisId={s.axis === 'right' ? 'right' : 'left'}
                />
              ))}

            {/* Line series — each rendered as a visible line + an invisible wide hit-target */}
            {series
              .filter((s) => s.type === 'line')
              .map((s) => {
                const lineCurveType = s.curveType ?? curveType;
                const lineConnectNulls = s.connectNulls ?? connectNulls;
                const yId = s.axis === 'right' ? 'right' : 'left';

                return (
                  <Fragment key={s.key}>
                    <Line
                      activeDot={(dotProps: any) => {
                        const {
                          dotCx,
                          dotCy,
                          stroke,
                          strokeLinecap,
                          strokeLinejoin,
                          strokeWidth,
                          dataKey,
                        } = dotProps;
                        return (
                          <Dot
                            className={cx(css`
                              fill: ${categoryColors.get(dataKey) ?? cssVar.colorPrimary};
                            `)}
                            cx={dotCx}
                            cy={dotCy}
                            fill=""
                            onClick={(_: any, event: any) => onDotClick(dotProps, event)}
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
                        stroke: ${categoryColors.get(s.key) ?? cssVar.colorPrimary};
                      `)}
                      connectNulls={lineConnectNulls}
                      dataKey={s.key}
                      dot={(dotProps: any) => {
                        const {
                          stroke,
                          strokeLinecap,
                          strokeLinejoin,
                          strokeWidth,
                          cx: dotCx,
                          cy: dotCy,
                          dataKey,
                          index: dotIndex,
                        } = dotProps;

                        if (
                          (hasOnlyOneValueForThisKey(data, s.key) &&
                            !(activeDot || (activeLegend && activeLegend !== s.key))) ||
                          (activeDot?.index === dotIndex && activeDot?.dataKey === s.key)
                        ) {
                          return (
                            <Dot
                              className={cx(css`
                                fill: ${categoryColors.get(dataKey) ?? cssVar.colorPrimary};
                              `)}
                              cx={dotCx}
                              cy={dotCy}
                              fill=""
                              key={dotIndex}
                              r={5}
                              stroke={stroke}
                              strokeLinecap={strokeLinecap}
                              strokeLinejoin={strokeLinejoin}
                              strokeWidth={strokeWidth}
                            />
                          );
                        }
                        return <Fragment key={dotIndex} />;
                      }}
                      isAnimationActive={showAnimation}
                      name={s.key}
                      stroke=""
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity={
                        activeDot || (activeLegend && activeLegend !== s.key) ? 0.3 : 1
                      }
                      strokeWidth={2}
                      type={lineCurveType}
                      yAxisId={yId}
                    />
                    {onValueChange && (
                      <Line
                        connectNulls={lineConnectNulls}
                        dataKey={s.key}
                        fill="transparent"
                        legendType="none"
                        name={s.key}
                        onClick={(lineProps: any, event: any) => {
                          event.stopPropagation();
                          onCategoryClick(lineProps.name);
                        }}
                        stroke="transparent"
                        strokeOpacity={0}
                        strokeWidth={12}
                        style={{ cursor: 'pointer' }}
                        tooltipType="none"
                        type={lineCurveType}
                        yAxisId={yId}
                      />
                    )}
                  </Fragment>
                );
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
