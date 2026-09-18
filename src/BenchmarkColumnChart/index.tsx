'use client';

import { Flexbox, Skeleton } from '@lobehub/ui';
import { cssVar, cx, useTheme } from 'antd-style';
import { readableColor } from 'polished';
import { type CSSProperties, MouseEvent, ReactNode, forwardRef, useMemo, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ErrorBar,
  LabelList,
  Line,
  ComposedChart as ReChartsComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

import ChartTooltip from '@/common/ChartTooltip';
import NoData from '@/common/NoData';
import {
  type BenchmarkBaseProps,
  type BenchmarkEventProps,
  type NormalizedBenchmarkItem,
  defaultBenchmarkErrorFormatter,
  defaultBenchmarkValueFormatter,
  getBenchmarkLabelMetrics,
  getBenchmarkMaxValue,
  normalizeBenchmarkData,
  splitBenchmarkLabel,
} from '@/common/benchmark';
import { constructCategoryColors, deepEqual, getYAxisDomain } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { getTextWidth } from '@/utils/getMaxLabelLength';

import { styles } from './styles';

export interface BenchmarkColumnChartProps extends BenchmarkBaseProps {
  animationDuration?: number;
  /**
   * Auto-compute Y min
   * @default false
   */
  autoMinValue?: boolean;
  /**
   * Gap between bar categories
   * @default '10%'
   */
  barCategoryGap?: string | number;
  /**
   * Display name for the bar series in legend / tooltip.
   * Pass `false` or `''` to hide from the legend (tooltip still uses a fallback).
   * @default 'Score'
   */
  barName?: string | false;
  /**
   * Rounded top corners radius
   * @default 0
   */
  barRadius?: number;
  /**
   * Fallback colors when items omit per-item color
   */
  colors?: string[];
  /**
   * Rotate X-axis labels
   * @default -66
   */
  labelAngle?: number;
  /**
   * X-axis label font size
   * @default 11
   */
  labelFontSize?: number;
  /**
   * Height reserved for icons + X-axis labels (via XAxis height)
   * @default auto from label length / angle
   */
  labelHeight?: number;
  /**
   * Color of the overlay line
   * @default theme.gold
   */
  lineColor?: string;
  /**
   * Secondary line-series field
   * @default 'line'
   */
  lineKey?: string;
  /**
   * Display name for the line series in legend / tooltip.
   * Pass `false` or `''` to hide from the legend (tooltip still uses a fallback).
   * @default 'Overall'
   */
  lineName?: string | false;
  /**
   * Override Y domain max
   */
  maxValue?: number;
  /**
   * Override Y domain min
   * @default 0
   */
  minValue?: number;
  /**
   * Minimum chart width; enables horizontal scroll when container is narrower
   */
  minWidth?: number;
  /**
   * Custom rank renderer. Default is `#${rank}`.
   */
  renderRank?: (item: NormalizedBenchmarkItem) => ReactNode;
  /**
   * Show AccuracyBar-style error bars
   * @default true
   */
  showErrorBars?: boolean;
  /**
   * Show dashed horizontal grid lines
   * @default true
   */
  showGridLines?: boolean;
  /**
   * Show legend when a line series is present
   * @default true
   */
  showLegend?: boolean;
  /**
   * Show overlay line series when data includes line values
   * @default true
   */
  showLine?: boolean;
  /**
   * Show numeric labels above line points
   * @default true
   */
  showLineLabel?: boolean;
  /**
   * Show rank under each column (bottom of X-axis labels)
   * @default false
   */
  showRank?: boolean;
  /**
   * Show tooltip
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Show numeric labels on bars
   * @default true
   */
  showValueLabel?: boolean;
  /**
   * Show X axis line (category labels stay visible)
   * @default false
   */
  showXAxis?: boolean;
  /**
   * Show Y axis line + value ticks
   * @default false
   */
  showYAxis?: boolean;
  /**
   * Annotation shown near the unranked separator.
   * Pass `false` or `''` to hide.
   */
  unrankedLabel?: string | false;
  /**
   * Font size for numeric labels on bars
   * @default 12
   */
  valueLabelFontSize?: number;
}

interface TickProps {
  payload: { value: string | number };
  x: number;
  y: number;
}

const RoundedTopBar = (props: any) => {
  const { fill, x, y, width, height, radius = 0 } = props;
  if (height <= 0) return null;

  if (!radius) {
    return <rect fill={fill} height={height} width={width} x={x} y={y} />;
  }

  const r = Math.min(radius, width / 2, height);
  const path = `
    M${x},${y + height}
    L${x},${y + r}
    Q${x},${y} ${x + r},${y}
    L${x + width - r},${y}
    Q${x + width},${y} ${x + width},${y + r}
    L${x + width},${y + height}
    Z
  `;

  return <path d={path} fill={fill} />;
};

const BenchmarkColumnChart = forwardRef<HTMLDivElement, BenchmarkColumnChartProps>((props, ref) => {
  const theme = useTheme();
  const themeColorRange = useThemeColorRange();
  const {
    data = [],
    index,
    valueKey,
    providerKey,
    iconKey,
    colorKey,
    errorKey,
    lineKey,
    renderIcon,
    colors = themeColorRange,
    valueFormatter = defaultBenchmarkValueFormatter,
    accuracyFormatter,
    errorFormatter = defaultBenchmarkErrorFormatter,
    showError = true,
    showErrorBars = true,
    showAnimation = false,
    animationDuration = 900,
    onValueChange,
    sortOrder = 'descending',
    className,
    style,
    loading,
    width = '100%',
    height = 320,
    noDataText,
    barCategoryGap = '10%',
    barRadius = 0,
    barName,
    lineName,
    lineColor,
    minWidth,
    maxValue,
    minValue = 0,
    autoMinValue = false,
    labelAngle = -66,
    labelFontSize = 11,
    showGridLines = true,
    showValueLabel = true,
    valueLabelFontSize = 12,
    showRank = false,
    renderRank,
    showLine = true,
    showLineLabel = true,
    showLegend = true,
    unrankedLabel,
    showXAxis = false,
    showYAxis = false,
    showTooltip = true,
    highlightColor,
    ...rest
  } = props;

  const [activeBar, setActiveBar] = useState<NormalizedBenchmarkItem | undefined>();
  const displayFormatter = accuracyFormatter ?? valueFormatter;
  const enableError = showError && showErrorBars;
  void errorFormatter;
  const resolvedHighlightColor = highlightColor ?? theme.gold;

  // false / '' hide from legend; undefined keeps default labels for tooltip + legend
  const legendBarName = barName === false || barName === '' ? null : (barName ?? 'Score');
  const legendLineName = lineName === false || lineName === '' ? null : (lineName ?? 'Overall');
  const tooltipBarName = legendBarName ?? 'Score';
  const tooltipLineName = legendLineName ?? 'Overall';
  const resolvedUnrankedLabel =
    unrankedLabel === false || unrankedLabel === '' ? null : (unrankedLabel ?? null);

  const items = useMemo(
    () =>
      normalizeBenchmarkData({
        colorKey,
        data,
        errorKey,
        iconKey,
        index,
        lineKey,
        providerKey,
        renderIcon,
        sortOrder,
        valueKey,
      }),
    [
      colorKey,
      data,
      errorKey,
      iconKey,
      index,
      lineKey,
      providerKey,
      renderIcon,
      sortOrder,
      valueKey,
    ],
  );

  const chartData = useMemo(
    () =>
      items.map((item) => ({
        ...item.original,
        __color: item.color,
        __error: item.error,
        __icon: item.icon,
        __key: item.key,
        // Break path before unranked; solo series draws the isolated dot
        __line: item.unranked ? null : (item.lineValue ?? null),
        __lineSolo: item.unranked ? (item.lineValue ?? null) : null,
        __name: item.name,
        __provider: item.provider,
        __rank: item.rank,
        __unranked: item.unranked,
        __value: item.value,
      })),
    [items],
  );

  const enableLine =
    showLine && items.some((item) => item.lineValue !== undefined && item.lineValue !== null);
  const firstUnrankedKey = items.find((item) => item.unranked)?.key;
  const resolvedLineColor = lineColor ?? theme.gold;

  const itemMap = useMemo(() => {
    const map = new Map<string | number, NormalizedBenchmarkItem>();
    for (const item of items) map.set(item.key, item);
    return map;
  }, [items]);

  const resolvedMaxValue = useMemo(() => getBenchmarkMaxValue(items, maxValue), [items, maxValue]);
  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, resolvedMaxValue || undefined);
  const categoryColors = constructCategoryColors(
    items.map((item) => String(item.key)),
    colors,
  );

  const chartMinWidth = minWidth ?? Math.max(items.length * 52, 320);
  const numericHeight = typeof height === 'number' ? height : 360;

  const RANK_SLOT = 22;
  const RANK_GAP = 12;
  const BOTTOM_PAD = 16;
  const SIDE_PAD_MIN = 24;

  const { resolvedLabelHeight, rankY, sidePad } = useMemo(() => {
    const lineHeight = Math.ceil(labelFontSize * 1.25);
    const widthScale = labelFontSize / 12;
    const absAngle = Math.abs(labelAngle);
    const radians = (absAngle * Math.PI) / 180;
    let maxProjected = 0;
    let maxOverhang = 0;

    for (const item of items) {
      const { lineCount, longestWidth } = getBenchmarkLabelMetrics(item.name);
      const scaledWidth = longestWidth * widthScale;
      const blockHeight = lineCount * lineHeight;
      const projected =
        scaledWidth * Math.sin(radians) + blockHeight * Math.cos(radians) + (item.icon ? 36 : 12);
      maxProjected = Math.max(maxProjected, projected);

      // Steep tilt + end anchor needs side room; flat centered labels barely do
      if (absAngle < 20) {
        maxOverhang = Math.max(maxOverhang, 8);
      } else {
        maxOverhang = Math.max(maxOverhang, scaledWidth * Math.cos(radians) * 0.55);
      }
    }

    const labelBlock = Math.ceil(maxProjected + 16);
    const rankExtra = showRank ? RANK_GAP + RANK_SLOT : 0;
    const autoHeight = labelBlock + rankExtra;
    const maxLabelBudget = Math.max(120, Math.floor(numericHeight * 0.48));
    const height = Math.min(
      maxLabelBudget,
      props.labelHeight ? Math.max(props.labelHeight, autoHeight) : autoHeight,
    );

    return {
      rankY: showRank ? Math.min(height - 8, labelBlock + RANK_GAP + 12) : 0,
      resolvedLabelHeight: height,
      sidePad: Math.min(56, Math.max(SIDE_PAD_MIN, Math.ceil(maxOverhang) + 12)),
    };
  }, [items, labelAngle, labelFontSize, numericHeight, props.labelHeight, showRank]);

  // Negative tilt + end anchor hangs left; keep right margin tight
  const leftPad = sidePad + (showYAxis ? 4 : 0);
  const rightPad =
    Math.abs(labelAngle) >= 20 && labelAngle < 0
      ? Math.max(SIDE_PAD_MIN, Math.round(sidePad * 0.4))
      : sidePad;
  const headerPadInline = leftPad + (showYAxis ? 40 : 0);
  const showBarLegend = showLegend && legendBarName !== null;
  const showLineLegend = showLegend && legendLineName !== null;
  const showUnrankedAnnotation = firstUnrankedKey !== undefined && resolvedUnrankedLabel !== null;
  const showChartHeader = enableLine && (showBarLegend || showLineLegend || showUnrankedAnnotation);
  const chartTopPad = enableLine || enableError ? (showChartHeader ? 84 : 44) : 12;

  if (loading || !data) return <Skeleton.Block active height={height} width={width} />;

  const hasOnValueChange = !!onValueChange;

  const onBarClick = (entry: any, _idx: number, event: MouseEvent) => {
    event.stopPropagation();
    if (!onValueChange) return;

    const item = itemMap.get(entry.__key ?? entry.payload?.__key);
    if (!item) return;

    if (
      activeBar &&
      deepEqual(
        { key: activeBar.key, value: activeBar.value },
        { key: item.key, value: item.value },
      )
    ) {
      setActiveBar(undefined);
      onValueChange(null);
      return;
    }

    setActiveBar(item);
    const payload: BenchmarkEventProps = {
      ...item.original,
      eventType: 'bar',
      rank: item.rank,
      value: item.value,
    };
    onValueChange(payload);
  };

  const renderTick = ({ x, y, payload }: TickProps) => {
    const item = itemMap.get(payload.value);
    if (!item) return <g />;

    const labelY = item.icon ? 36 : 12;
    const lines = splitBenchmarkLabel(item.name);
    const lineHeight = Math.ceil(labelFontSize * 1.25);
    const highlightFill = item.highlighted ? resolvedHighlightColor : undefined;

    return (
      <g transform={`translate(${x},${y})`}>
        {item.icon ? (
          <foreignObject height={24} overflow="visible" width={28} x={-14} y={4}>
            <div className={styles.iconWrap}>{item.icon as ReactNode}</div>
          </foreignObject>
        ) : null}
        <text
          className={styles.tickLabel}
          fill={highlightFill}
          fontSize={labelFontSize}
          style={{ fontSize: labelFontSize, ...(highlightFill ? { fill: highlightFill } : null) }}
          textAnchor={labelAngle < 0 ? 'end' : labelAngle > 0 ? 'start' : 'middle'}
          transform={`rotate(${labelAngle}, 0, ${labelY})`}
          x={0}
          y={labelY}
        >
          <title>{String(item.name).replaceAll('\n', ' ')}</title>
          {lines.map((line, lineIndex) => (
            <tspan dy={lineIndex === 0 ? 4 : lineHeight} key={`${item.key}-${lineIndex}`} x={0}>
              {line}
            </tspan>
          ))}
        </text>
        {showRank ? (
          renderRank ? (
            <foreignObject height={20} overflow="visible" width={48} x={-24} y={rankY - 16}>
              <div
                className={styles.rank}
                style={highlightFill ? { color: highlightFill } : undefined}
              >
                {renderRank(item)}
              </div>
            </foreignObject>
          ) : (
            <text
              className={styles.rank}
              dominantBaseline="auto"
              fill={highlightFill}
              fontSize={14}
              style={highlightFill ? { fill: highlightFill } : undefined}
              textAnchor="middle"
              x={0}
              y={rankY}
            >
              #{item.rank}
            </text>
          )
        ) : null}
      </g>
    );
  };

  return (
    <Flexbox
      className={cx(styles.container, className)}
      height={numericHeight}
      ref={ref}
      style={
        {
          '--benchmark-header-pad-inline': `${headerPadInline}px`,
          '--benchmark-label-font-size': `${labelFontSize}px`,
          '--benchmark-value-label-font-size': `${valueLabelFontSize}px`,
          'position': 'relative',
          ...style,
        } as CSSProperties
      }
      width={width}
      {...rest}
    >
      <div
        style={{
          height: numericHeight,
          minWidth: chartMinWidth,
          position: 'relative',
          width: '100%',
        }}
      >
        {showChartHeader ? (
          <div className={styles.chartHeader}>
            {showBarLegend || showLineLegend ? (
              <div className={styles.legend}>
                {showBarLegend ? (
                  <span className={styles.legendItem}>
                    <span className={styles.legendBars} style={{ background: cssVar.colorText }} />
                    {legendBarName}
                  </span>
                ) : null}
                {showLineLegend ? (
                  <span className={styles.legendItem}>
                    <span
                      className={styles.legendLine}
                      style={{ borderColor: resolvedLineColor }}
                    />
                    {legendLineName}
                  </span>
                ) : null}
              </div>
            ) : (
              <span />
            )}
            {showUnrankedAnnotation ? (
              <div className={styles.unrankedLabel}>{resolvedUnrankedLabel}</div>
            ) : null}
          </div>
        ) : null}
        <ResponsiveContainer height={numericHeight} width="100%">
          {chartData.length ? (
            <ReChartsComposedChart
              barCategoryGap={barCategoryGap}
              data={chartData}
              margin={{
                bottom: BOTTOM_PAD,
                left: leftPad,
                right: rightPad,
                top: chartTopPad,
              }}
              onClick={
                hasOnValueChange && activeBar
                  ? () => {
                      setActiveBar(undefined);
                      onValueChange?.(null);
                    }
                  : undefined
              }
            >
              {showGridLines ? (
                <CartesianGrid className={styles.gridLines} horizontal vertical={false} />
              ) : null}
              <XAxis
                axisLine={showXAxis}
                dataKey="__key"
                height={resolvedLabelHeight}
                interval={0}
                stroke={showXAxis ? cssVar.colorBorder : undefined}
                tick={renderTick}
                tickLine={showXAxis}
              />
              <YAxis
                allowDecimals
                axisLine={showYAxis}
                domain={yAxisDomain as AxisDomain}
                hide={!showYAxis}
                stroke={showYAxis ? cssVar.colorBorder : undefined}
                tick={{ fill: cssVar.colorTextDescription, fontSize: 12 }}
                tickFormatter={displayFormatter}
                tickLine={showYAxis}
                width={showYAxis ? 40 : 0}
              />
              <Tooltip
                content={
                  showTooltip
                    ? ({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const entry = payload[0]?.payload;
                        const item = itemMap.get(entry?.__key);
                        if (!item) return null;

                        const modelName = String(item.name).replaceAll('\n', ' ');
                        const title = item.provider
                          ? String(item.provider)
                          : accuracyFormatter
                            ? 'Accuracy'
                            : 'Score';
                        const swatch =
                          item.color ?? categoryColors.get(String(item.key)) ?? cssVar.colorPrimary;
                        const tooltipPayload: Array<{
                          color?: string;
                          dataKey: string;
                          name: string;
                          value: number;
                        }> = [
                          {
                            color: swatch,
                            dataKey: '__value',
                            name: tooltipBarName,
                            value: item.value,
                          },
                        ];
                        if (enableLine && item.lineValue !== undefined) {
                          tooltipPayload.push({
                            color: resolvedLineColor,
                            dataKey: '__line',
                            name: tooltipLineName,
                            value: item.lineValue,
                          });
                        }

                        return (
                          <ChartTooltip
                            active={active}
                            categoryColors={
                              new Map([
                                [tooltipBarName, swatch],
                                [tooltipLineName, resolvedLineColor],
                              ])
                            }
                            label={
                              item.unranked && resolvedUnrankedLabel
                                ? `${title} · ${modelName}`
                                : title
                            }
                            payload={tooltipPayload}
                            valueFormatter={(val: number): any => displayFormatter(Number(val))}
                          />
                        );
                      }
                    : undefined
                }
                cursor={{ fill: cssVar.colorFillTertiary }}
                isAnimationActive={false}
                wrapperStyle={{ outline: 'none' }}
              />
              {firstUnrankedKey !== undefined ? (
                <ReferenceLine
                  ifOverflow="extendDomain"
                  position="start"
                  stroke={cssVar.colorBorder}
                  strokeDasharray="4 4"
                  x={firstUnrankedKey}
                />
              ) : null}
              <Bar
                animationDuration={animationDuration}
                dataKey="__value"
                isAnimationActive={showAnimation}
                name={tooltipBarName}
                onClick={onBarClick}
                shape={(shapeProps: any) => <RoundedTopBar {...shapeProps} radius={barRadius} />}
                style={{ cursor: onValueChange ? 'pointer' : undefined }}
              >
                {chartData.map((entry) => {
                  const fill =
                    entry.__color ?? categoryColors.get(String(entry.__key)) ?? cssVar.colorPrimary;
                  const dimmed = activeBar && activeBar.key !== entry.__key;
                  return (
                    <Cell fill={fill} fillOpacity={dimmed ? 0.35 : 1} key={String(entry.__key)} />
                  );
                })}
                {showValueLabel ? (
                  <LabelList
                    content={(labelProps: any) => {
                      const {
                        x,
                        y,
                        width: barWidth,
                        height: barHeight,
                        value,
                        index: barIndex,
                      } = labelProps;
                      const entry = chartData[barIndex];
                      if (
                        x === undefined ||
                        y === undefined ||
                        barWidth === undefined ||
                        barHeight === undefined
                      )
                        return null;

                      const text = displayFormatter(Number(value ?? 0));
                      const textWidth = getTextWidth(text) * (valueLabelFontSize / 12);
                      // Leave room under the lower error whisker when error bars are on
                      const labelInset = enableError ? 18 : 8;
                      if (
                        Number(barWidth) < textWidth + 8 ||
                        Number(barHeight) < labelInset + valueLabelFontSize + 2
                      )
                        return null;

                      const fill =
                        entry?.__color ??
                        categoryColors.get(String(entry?.__key)) ??
                        cssVar.colorPrimary;
                      let labelFill = cssVar.colorTextLightSolid;
                      try {
                        labelFill = readableColor(fill, '#000000', '#ffffff', false);
                      } catch {
                        // keep default for invalid / css-var colors
                      }

                      return (
                        <text
                          className={styles.valueLabel}
                          dominantBaseline="hanging"
                          fill={labelFill}
                          fontSize={valueLabelFontSize}
                          style={{ fontSize: valueLabelFontSize }}
                          textAnchor="middle"
                          x={Number(x) + Number(barWidth) / 2}
                          y={Number(y) + labelInset}
                        >
                          {text}
                        </text>
                      );
                    }}
                    dataKey="__value"
                    position="insideTop"
                  />
                ) : null}
                {enableError ? (
                  <ErrorBar
                    dataKey="__error"
                    direction="y"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    width={4}
                  />
                ) : null}
              </Bar>
              {enableLine ? (
                <Line
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                  dataKey="__line"
                  dot={(dotProps: any) => {
                    const { cx, cy, payload, value } = dotProps;
                    if (
                      value === undefined ||
                      value === null ||
                      cx === undefined ||
                      cy === undefined
                    ) {
                      return <g key={`dot-${payload?.__key ?? 'x'}`} />;
                    }
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        fill={cssVar.colorBgContainer}
                        key={`dot-${payload.__key}`}
                        r={4}
                        stroke={resolvedLineColor}
                        strokeWidth={1.5}
                      />
                    );
                  }}
                  isAnimationActive={showAnimation}
                  name={tooltipLineName}
                  stroke={resolvedLineColor}
                  strokeWidth={2}
                  type="monotone"
                >
                  {showLineLabel ? (
                    <LabelList
                      content={(labelProps: any) => {
                        const { x, y, value } = labelProps;
                        if (
                          value === undefined ||
                          value === null ||
                          x === undefined ||
                          y === undefined
                        )
                          return null;
                        return (
                          <text
                            className={styles.lineLabel}
                            fill={resolvedLineColor}
                            fontSize={valueLabelFontSize}
                            textAnchor="middle"
                            x={Number(x)}
                            y={Number(y) - 10}
                          >
                            {displayFormatter(Number(value))}
                          </text>
                        );
                      }}
                      dataKey="__line"
                      position="top"
                    />
                  ) : null}
                </Line>
              ) : null}
              {enableLine ? (
                <Line
                  connectNulls={false}
                  dataKey="__lineSolo"
                  dot={(dotProps: any) => {
                    const { cx, cy, payload, value } = dotProps;
                    if (
                      value === undefined ||
                      value === null ||
                      cx === undefined ||
                      cy === undefined
                    ) {
                      return <g key={`solo-${payload?.__key ?? 'x'}`} />;
                    }
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        fill={cssVar.colorBgContainer}
                        key={`solo-${payload.__key}`}
                        r={4}
                        stroke={resolvedLineColor}
                        strokeWidth={1.5}
                      />
                    );
                  }}
                  isAnimationActive={false}
                  legendType="none"
                  stroke="transparent"
                  strokeWidth={0}
                  type="monotone"
                >
                  {showLineLabel ? (
                    <LabelList
                      content={(labelProps: any) => {
                        const { x, y, value } = labelProps;
                        if (
                          value === undefined ||
                          value === null ||
                          x === undefined ||
                          y === undefined
                        )
                          return null;
                        return (
                          <text
                            className={styles.lineLabel}
                            fill={resolvedLineColor}
                            fontSize={valueLabelFontSize}
                            textAnchor="middle"
                            x={Number(x)}
                            y={Number(y) - 10}
                          >
                            {displayFormatter(Number(value))}
                          </text>
                        );
                      }}
                      dataKey="__lineSolo"
                      position="top"
                    />
                  ) : null}
                </Line>
              ) : null}
            </ReChartsComposedChart>
          ) : (
            <NoData noDataText={noDataText} />
          )}
        </ResponsiveContainer>
      </div>
    </Flexbox>
  );
});

BenchmarkColumnChart.displayName = 'BenchmarkColumnChart';

export default BenchmarkColumnChart;
