'use client';

import { Skeleton } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useId, useMemo, useState } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

import type { EventProps } from '@/common/BaseChartProps';
import type { CurveType, ValueFormatter } from '@/types/charts';

import { A2uiXTick, A2uiYTick, rightMarginFor, Y_TICK_PADDING, yAxisWidthFor } from './axis';
import { curveA2uiMonotone } from './curve';
import { type ChartNumberFormat, createTickFormatter, createValueFormatter } from './format';
import A2uiFrame from './Frame';
import A2uiPlacedTooltip from './PlacedTooltip';
import { niceScale } from './scale';
import { styles } from './styles';
import { A2UI_GRID, A2UI_PALETTE, A2UI_SURFACE, a2uiPaletteAt } from './tokens';
import A2uiTooltip from './Tooltip';
import { useElementWidth } from './useElementWidth';

export interface A2uiTrendChartProps {
  categories: string[];
  className?: string;
  colors?: string[];
  connectNulls?: boolean;
  currency?: string;
  curveType?: CurveType;
  customCategories?: Record<string, string>;
  data: any[];
  format?: ChartNumberFormat;
  height?: number | string;
  index: string;
  kind: 'line' | 'area';
  loading?: boolean;
  maxValue?: number;
  minValue?: number;
  noDataText?: ReactNode;
  onValueChange?: (value: EventProps) => void;
  ref?: Ref<HTMLElement>;
  showAnimation?: boolean;
  showGradient?: boolean;
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

/** Official plot margins: line charts sit 9px from the top, areas 10px; both keep 22.8px for x ticks. */
const TOP = { area: 10, line: 9 } as const;
const BOTTOM = 22.8;
const RIGHT = 4;
/** scalePoint padding of the official x axis. */
const POINT_PADDING = { area: 0.02, line: 0.25 } as const;

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `LineChart` / `AreaChart`.
const A2uiTrendChart = ({
  kind,
  data = [],
  index,
  categories = [],
  colors = A2UI_PALETTE,
  stack = false,
  connectNulls = false,
  curveType,
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
  showGradient = true,
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
}: A2uiTrendChartProps) => {
  const uid = useId().replaceAll(':', '');
  const [plotRef, width, fontFamily] = useElementWidth();
  const [focus, setFocus] = useState<{ name: string; x: number; y: number } | undefined>();
  const plotHeight = typeof height === 'number' ? height : 220;

  const names = categories;
  const colorOf = (name: string) => {
    const i = Math.max(0, names.indexOf(name));
    return a2uiPaletteAt(i, colors);
  };
  const labelOf = (name: string) => customCategories?.[name] ?? name;
  const single = names.length === 1;
  const stacked = kind === 'area' && stack && names.length > 1;
  const curve = curveType ?? curveA2uiMonotone;

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
    let nonNegative = true;
    for (const row of data) {
      let total = 0;
      for (const name of names) {
        const v = row?.[name];
        if (!isNum(v)) continue;
        if (v < 0) nonNegative = false;
        total += v;
        if (!stacked) values.push(v);
      }
      if (stacked) values.push(total);
    }
    if (isNum(minValue)) values.push(minValue);
    if (isNum(maxValue)) values.push(maxValue);
    // An area (or the fill under a lone line) starts at zero, so zero is in the domain.
    const includeZero = kind === 'area' || (single && nonNegative);
    return niceScale(values, { includeZero });
  }, [data, names, stacked, kind, single, minValue, maxValue]);

  const fillUnderLine = kind === 'line' && single && domain[0] >= 0;

  const yLabels = ticks.map((t) => formatTick(t));
  const left = showYAxis ? yAxisWidthFor(yLabels, 0, fontFamily) + Y_TICK_PADDING : RIGHT;
  const n = data.length;
  const p = POINT_PADDING[kind];
  const lastLabel = n > 0 ? String((xAxisLabelFormatter ?? String)(data[n - 1]?.[index])) : '';
  // Keep the last x label inside the card.
  const right = showXAxis
    ? rightMarginFor(lastLabel, (p * (width - left - RIGHT)) / (n - 1 + 2 * p || 1), fontFamily)
    : RIGHT;
  const plotWidth = Math.max(0, width - left - right);
  const step = n > 1 ? plotWidth / (n - 1 + 2 * p) : plotWidth;
  const xPad = n > 1 ? step * p : plotWidth / 2;
  const top = TOP[kind];
  const bottom = showXAxis ? BOTTOM : 4;

  const legend =
    showLegend && names.length > 1
      ? names.map((name) => ({ color: colorOf(name), label: labelOf(name) }))
      : undefined;

  const empty = !loading && (data.length === 0 || names.length === 0);

  const fadeId = (i: number) => `a2ui-fade-${uid}-${i}`;

  const renderTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const seen = new Set<string>();
    const items = (payload as any[]).filter((p) => {
      const key = String(p.dataKey);
      if (seen.has(key) || !names.includes(key)) return false;
      seen.add(key);
      return true;
    });
    // Rows read top-down like the marks: reversed stack order, otherwise by value.
    if (stacked) items.reverse();
    else
      items.sort(
        (a, b) => (isNum(b.value) ? b.value : -Infinity) - (isNum(a.value) ? a.value : -Infinity),
      );
    const total = items.reduce((s, p) => s + (isNum(p.value) ? p.value : 0), 0);
    if (!focus) return null;
    return (
      <A2uiPlacedTooltip height={plotHeight} width={width} x={focus.x} y={focus.y}>
        <A2uiTooltip
          title={xAxisLabelFormatter ? xAxisLabelFormatter(label) : String(label ?? '')}
          rows={[
            ...items.map((p) => ({
              color: colorOf(String(p.dataKey)),
              label: single && title ? title : labelOf(String(p.dataKey)),
              value: formatTooltip(p.value),
            })),
            ...(stacked ? [{ active: true, label: 'Total', value: formatTooltip(total) }] : []),
          ]}
        />
      </A2uiPlacedTooltip>
    );
  };

  // The official chart focuses the series nearest the pointer: one ring, and the tooltip above it.
  const plotBottom = plotHeight - bottom;
  const yPixel = (v: number) =>
    top + (1 - (v - domain[0]) / (domain[1] - domain[0] || 1)) * (plotBottom - top);
  const onMouseMove = (state: any) => {
    const i = state?.activeTooltipIndex;
    const x = state?.activeCoordinate?.x;
    if (!state?.isTooltipActive || typeof i !== 'number' || !isNum(x) || !isNum(state.chartY)) {
      setFocus(undefined);
      return;
    }
    const row = data[i];
    let acc = 0;
    let best: { name: string; x: number; y: number } | undefined;
    for (const name of names) {
      const v = row?.[name];
      if (!isNum(v)) continue;
      acc += v;
      const y = yPixel(stacked ? acc : v);
      if (!best || Math.abs(y - state.chartY) < Math.abs(best.y - state.chartY))
        best = { name, x, y };
    }
    if (best?.name !== focus?.name || best?.x !== focus?.x || best?.y !== focus?.y) setFocus(best);
  };

  const activeDot = (name: string) =>
    focus?.name === name && {
      fill: A2UI_SURFACE,
      onClick: onValueChange
        ? (_: any, payload: any) =>
            onValueChange({ categoryClicked: name, eventType: 'dot', ...payload?.payload })
        : undefined,
      r: 4.5,
      stroke: colorOf(name),
      strokeWidth: 2,
    };

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
      <div className={styles.plot} ref={plotRef} style={{ height: plotHeight }}>
        {loading ? (
          <Skeleton height={plotHeight} width={'100%'} />
        ) : width > 0 ? (
          <ComposedChart
            data={data}
            height={plotHeight}
            margin={{ bottom: 0, left: 0, right, top }}
            width={width}
            onMouseLeave={() => setFocus(undefined)}
            onMouseMove={onMouseMove}
          >
            <defs>
              {names.map((name, i) => (
                <linearGradient id={fadeId(i)} key={name} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={colorOf(name)} stopOpacity={0.34} />
                  <stop offset="0.65" stopColor={colorOf(name)} stopOpacity={0.08} />
                  <stop offset="1" stopColor={colorOf(name)} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {showGridLines && <CartesianGrid {...A2UI_GRID} horizontal vertical={false} />}
            <XAxis
              axisLine={false}
              dataKey={index}
              height={showXAxis ? bottom : 0}
              hide={!showXAxis}
              interval="preserveStartEnd"
              minTickGap={6}
              padding={{ left: xPad, right: xPad }}
              tick={<A2uiXTick formatter={xAxisLabelFormatter} />}
              tickLine={false}
              tickMargin={0}
              tickSize={0}
            />
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
            {showTooltip && (
              <Tooltip
                allowEscapeViewBox={{ x: true, y: true }}
                content={renderTooltip}
                cursor={{ stroke: 'var(--a2-chart-fg)', strokeOpacity: 0.35, strokeWidth: 1 }}
                isAnimationActive={false}
                position={{ x: 0, y: 0 }}
                wrapperStyle={{ height: 0, outline: 'none', width: 0, zIndex: 1 }}
              />
            )}
            {kind === 'area' &&
              names.map((name, i) =>
                stacked ? (
                  <Area
                    activeDot={activeDot(name)}
                    animationDuration={900}
                    connectNulls={connectNulls}
                    dataKey={name}
                    fill={colorOf(name)}
                    fillOpacity={0.62}
                    isAnimationActive={showAnimation}
                    key={name}
                    name={name}
                    stackId="a2ui"
                    stroke={A2UI_SURFACE}
                    strokeWidth={1}
                    type={curve as any}
                  />
                ) : (
                  <Area
                    activeDot={activeDot(name)}
                    animationDuration={900}
                    connectNulls={connectNulls}
                    dataKey={name}
                    fill={showGradient ? `url(#${fadeId(i)})` : colorOf(name)}
                    fillOpacity={showGradient ? 1 : 0.2}
                    isAnimationActive={showAnimation}
                    key={name}
                    name={name}
                    stroke={colorOf(name)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    type={curve as any}
                  />
                ),
              )}
            {kind === 'line' &&
              fillUnderLine &&
              showGradient &&
              names.map((name, i) => (
                <Area
                  activeDot={false}
                  connectNulls={connectNulls}
                  dataKey={name}
                  fill={`url(#${fadeId(i)})`}
                  fillOpacity={1}
                  isAnimationActive={showAnimation}
                  key={`fill-${name}`}
                  legendType="none"
                  stroke="none"
                  tooltipType="none"
                  type={curve as any}
                />
              ))}
            {kind === 'line' &&
              names.map((name) => (
                <Line
                  activeDot={activeDot(name)}
                  animationDuration={900}
                  connectNulls={connectNulls}
                  dataKey={name}
                  isAnimationActive={showAnimation}
                  key={name}
                  name={name}
                  stroke={colorOf(name)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  type={curve as any}
                  dot={
                    n * names.length <= 16
                      ? { fill: colorOf(name), r: 2.5, stroke: 'none', strokeWidth: 0 }
                      : false
                  }
                />
              ))}
          </ComposedChart>
        ) : null}
      </div>
    </A2uiFrame>
  );
};

A2uiTrendChart.displayName = 'A2uiTrendChart';

export default A2uiTrendChart;
