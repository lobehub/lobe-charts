'use client';

import { Skeleton } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Customized, Tooltip, XAxis, YAxis } from 'recharts';

import {
  A2UI_GRID,
  A2UI_PALETTE,
  A2UI_SURFACE,
  A2uiFrame,
  a2uiPaletteAt,
  A2uiPlacedTooltip,
  a2uiStyles,
  A2uiTooltip,
  A2uiXTick,
  A2uiYTick,
  type ChartNumberFormat,
  createTickFormatter,
  createValueFormatter,
  niceScale,
  rightMarginFor,
  shortLabel,
  useElementWidth,
  Y_TICK_PADDING,
  yAxisWidthFor,
} from '@/common/a2ui';
import type { EventProps } from '@/common/BaseChartProps';
import type { ValueFormatter } from '@/types/charts';

export interface A2uiBarChartProps {
  categories: string[];
  className?: string;
  colors?: string[];
  currency?: string;
  customCategories?: Record<string, string>;
  data: any[];
  format?: ChartNumberFormat;
  height?: number | string;
  index: string;
  layout?: 'vertical' | 'horizontal';
  loading?: boolean;
  maxValue?: number;
  minValue?: number;
  noDataText?: ReactNode;
  onValueChange?: (value: EventProps) => void;
  ref?: Ref<HTMLElement>;
  showAnimation?: boolean;
  showGridLines?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  stack?: boolean;
  style?: CSSProperties;
  subtitle?: string;
  title?: string;
  unit?: string;
  valueFormatter?: ValueFormatter;
  xAxisLabelFormatter?: (v: any) => string;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Official plot margins for bars. */
const TOP = 10;
const BOTTOM = 20.8;
const RIGHT = 4;
/** Category label padding on a horizontal bar chart. */
const CATEGORY_PADDING = 10;

/**
 * Bar geometry of the official chart (d3 band scale, then a group band inside it) expressed as recharts
 * axis padding, category gap, bar size and bar gap.
 */
export const bandLayout = ({
  length,
  count,
  series,
  grouped,
}: {
  count: number;
  grouped: boolean;
  length: number;
  series: number;
}) => {
  const multi = series > 1;
  const padding = multi ? 0.24 : 0.32;
  const step = count > 0 ? length / (count + padding) : length;
  const bandwidth = step * (1 - padding);
  const edge = (step * padding) / 2;
  if (grouped) {
    const subStep = bandwidth / (series + 0.12);
    const barSize = Math.max(1, Math.min(subStep * 0.88, 18));
    return { barGap: subStep - barSize, barSize, categoryGap: edge, edge };
  }
  return { barGap: 0, barSize: Math.max(1, Math.min(bandwidth, 40)), categoryGap: edge, edge };
};

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `BarChart`.
const A2uiBarChart = ({
  data = [],
  index,
  categories = [],
  colors = A2UI_PALETTE,
  layout = 'horizontal',
  stack = false,
  format,
  currency,
  unit,
  valueFormatter,
  xAxisLabelFormatter,
  title,
  subtitle,
  height,
  loading,
  noDataText,
  showAnimation = false,
  showGridLines = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  minValue,
  maxValue,
  customCategories,
  onValueChange,
  className,
  style,
  ref,
}: A2uiBarChartProps) => {
  const [plotRef, width, fontFamily] = useElementWidth();
  const [focus, setFocus] = useState<{ name: string; x: number; y: number } | undefined>();
  const names = categories;
  const multi = names.length > 1;
  const grouped = multi && !stack;
  // recharts `layout="vertical"` lays bars out horizontally.
  const horizontal = layout === 'vertical';
  const count = data.length;
  const plotHeight =
    typeof height === 'number'
      ? height
      : horizontal
        ? Math.max(160, count * (multi && grouped ? 40 : 30) + 40)
        : 230;

  const colorOf = (name: string) => a2uiPaletteAt(Math.max(0, names.indexOf(name)), colors);
  const labelOf = (name: string) => customCategories?.[name] ?? name;
  const categoryLabel = (v: unknown) =>
    xAxisLabelFormatter ? xAxisLabelFormatter(v) : String(v ?? '');

  const formatTooltip = useMemo(
    () => valueFormatter ?? createValueFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );
  const formatTick = useMemo(
    () => valueFormatter ?? createTickFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );

  const { domain, ticks } = useMemo(() => {
    const values: number[] = [];
    for (const row of data) {
      let pos = 0;
      let neg = 0;
      for (const name of names) {
        const v = row?.[name];
        if (!isNum(v)) continue;
        if (stack) {
          if (v >= 0) pos += v;
          else neg += v;
        } else values.push(v);
      }
      if (stack) values.push(pos, neg);
    }
    if (isNum(minValue)) values.push(minValue);
    if (isNum(maxValue)) values.push(maxValue);
    return niceScale(values, { includeZero: true });
  }, [data, names, stack, minValue, maxValue]);

  const valueLabels = ticks.map((t) => formatTick(t));

  let left: number;
  let right = RIGHT;
  let bottom: number;
  let band: ReturnType<typeof bandLayout>;
  if (horizontal) {
    const catLabels = data.map((d) => shortLabel(categoryLabel(d?.[index]), 18));
    left = showYAxis ? yAxisWidthFor(catLabels, 0, fontFamily) + CATEGORY_PADDING : RIGHT;
    // Keep the last value tick inside the card.
    right = showXAxis ? rightMarginFor(valueLabels.at(-1) ?? '', 0, fontFamily) : RIGHT;
    bottom = showXAxis ? BOTTOM + 2 : 4;
    band = bandLayout({
      count,
      grouped,
      length: Math.max(0, plotHeight - TOP - bottom),
      series: names.length,
    });
  } else {
    left = showYAxis ? yAxisWidthFor(valueLabels, 0, fontFamily) + Y_TICK_PADDING : RIGHT;
    bottom = showXAxis ? BOTTOM : 4;
    band = bandLayout({
      count,
      grouped,
      length: Math.max(0, width - left - right),
      series: names.length,
    });
  }

  const legend =
    showLegend && multi
      ? names.map((name) => ({ color: colorOf(name), label: labelOf(name) }))
      : undefined;
  const empty = !loading && (data.length === 0 || names.length === 0);

  const renderTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const items = (payload as any[]).filter((p) => names.includes(String(p.dataKey)));
    if (stack) items.reverse();
    else items.sort((a, b) => (isNum(b.value) ? b.value : 0) - (isNum(a.value) ? a.value : 0));
    if (!focus) return null;
    return (
      <A2uiPlacedTooltip height={plotHeight} width={width} x={focus.x} y={focus.y}>
        <A2uiTooltip
          title={categoryLabel(label)}
          rows={items.map((p) => ({
            color: colorOf(String(p.dataKey)),
            label: multi ? labelOf(String(p.dataKey)) : (title ?? 'Value'),
            value: formatTooltip(p.value),
          }))}
        />
      </A2uiPlacedTooltip>
    );
  };

  // Focus the bar under the pointer: a ring at its value end, and the tooltip anchored there.
  const valuePixel = (v: number) => {
    const t = (v - domain[0]) / (domain[1] - domain[0] || 1);
    return horizontal
      ? left + t * Math.max(0, width - left - right)
      : TOP + (1 - t) * Math.max(0, plotHeight - TOP - bottom);
  };
  const onMouseMove = (state: any) => {
    const i = state?.activeTooltipIndex;
    if (!state?.isTooltipActive || typeof i !== 'number' || !data[i]) {
      setFocus(undefined);
      return;
    }
    const along = horizontal ? state.chartY : state.chartX;
    const start = horizontal ? TOP : left;
    const length = horizontal
      ? Math.max(0, plotHeight - TOP - bottom)
      : Math.max(0, width - left - right);
    const step = (length - band.edge * 2) / (count || 1);
    const center = start + band.edge + (i + 0.5) * step;
    let acc = 0;
    let best: { d: number; name: string; x: number; y: number } | undefined;
    names.forEach((name, j) => {
      const v = data[i]?.[name];
      if (!isNum(v)) return;
      acc += v;
      const offset = grouped ? (j - (names.length - 1) / 2) * (band.barSize + band.barGap) : 0;
      const pos = center + offset;
      const end = valuePixel(stack ? acc : v);
      const d = grouped ? Math.abs(along - pos) : stack ? -j : 0;
      if (!best || d < best.d)
        best = horizontal ? { d, name, x: end, y: pos } : { d, name, x: pos, y: end };
    });
    const next = best && { name: best.name, x: best.x, y: best.y };
    if (next?.name !== focus?.name || next?.x !== focus?.x || next?.y !== focus?.y) setFocus(next);
  };

  const radiusFor = (i: number): [number, number, number, number] => {
    // Rounded at the value end; a stack rounds only its outer segment.
    const round = !stack || i === names.length - 1;
    if (!round) return [0, 0, 0, 0];
    return horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0];
  };

  const categoryAxis = horizontal ? (
    <YAxis
      axisLine={false}
      dataKey={index}
      hide={!showYAxis}
      interval={0}
      padding={{ bottom: band.edge, top: band.edge }}
      tick={<A2uiYTick formatter={(v: any) => shortLabel(categoryLabel(v), 18)} />}
      tickLine={false}
      tickMargin={CATEGORY_PADDING}
      tickSize={0}
      type="category"
      width={left}
    />
  ) : (
    <XAxis
      axisLine={false}
      dataKey={index}
      height={bottom}
      hide={!showXAxis}
      interval="preserveStartEnd"
      minTickGap={6}
      padding={{ left: band.edge, right: band.edge }}
      tick={<A2uiXTick formatter={(v: any) => shortLabel(categoryLabel(v), 12)} />}
      tickLine={false}
      tickMargin={0}
      tickSize={0}
      type="category"
    />
  );

  const valueAxis = horizontal ? (
    <XAxis
      axisLine={false}
      domain={domain}
      height={bottom}
      hide={!showXAxis}
      interval={0}
      tick={<A2uiXTick formatter={formatTick} />}
      tickLine={false}
      tickMargin={0}
      tickSize={0}
      ticks={ticks}
      type="number"
    />
  ) : (
    <YAxis
      axisLine={false}
      domain={domain}
      hide={!showYAxis}
      interval={0}
      tick={<A2uiYTick formatter={formatTick} />}
      tickLine={false}
      tickMargin={Y_TICK_PADDING}
      tickSize={0}
      ticks={ticks}
      type="number"
      width={left}
    />
  );

  return (
    <A2uiFrame
      className={className}
      empty={empty}
      emptyText={noDataText}
      legend={legend}
      ref={ref}
      style={style}
      subtitle={subtitle}
      title={title}
    >
      <div className={a2uiStyles.plot} ref={plotRef} style={{ height: plotHeight }}>
        {loading ? (
          <Skeleton height={plotHeight} width={'100%'} />
        ) : width > 0 ? (
          <BarChart
            barCategoryGap={band.categoryGap}
            barGap={band.barGap}
            data={data}
            height={plotHeight}
            layout={horizontal ? 'vertical' : 'horizontal'}
            margin={{ bottom: 0, left: 0, right, top: TOP }}
            width={width}
            onMouseLeave={() => setFocus(undefined)}
            onMouseMove={onMouseMove}
          >
            {showGridLines && (
              <CartesianGrid {...A2UI_GRID} horizontal={!horizontal} vertical={horizontal} />
            )}
            {horizontal ? valueAxis : categoryAxis}
            {horizontal ? categoryAxis : valueAxis}
            {showTooltip && (
              <Tooltip
                allowEscapeViewBox={{ x: true, y: true }}
                content={renderTooltip}
                cursor={false}
                isAnimationActive={false}
                position={{ x: 0, y: 0 }}
                wrapperStyle={{ height: 0, outline: 'none', width: 0, zIndex: 1 }}
              />
            )}
            {names.map((name, i) => (
              <Bar
                animationDuration={900}
                barSize={band.barSize}
                dataKey={name}
                fill={colorOf(name)}
                isAnimationActive={showAnimation}
                key={name}
                name={name}
                radius={radiusFor(i)}
                stackId={stack ? 'a2ui' : undefined}
                style={onValueChange ? { cursor: 'pointer' } : undefined}
                onClick={
                  onValueChange
                    ? (entry: any) =>
                        onValueChange({
                          categoryClicked: name,
                          eventType: 'bar',
                          ...entry?.payload,
                        })
                    : undefined
                }
              />
            ))}
            {showTooltip && focus && (
              <Customized
                component={() => (
                  <circle
                    cx={focus.x}
                    cy={focus.y}
                    fill={A2UI_SURFACE}
                    pointerEvents="none"
                    r={4.5}
                    stroke={colorOf(focus.name)}
                    strokeWidth={2}
                  />
                )}
              />
            )}
          </BarChart>
        ) : null}
      </div>
    </A2uiFrame>
  );
};

A2uiBarChart.displayName = 'A2uiBarChart';

export default A2uiBarChart;
