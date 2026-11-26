'use client';

import { Skeleton } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useMemo, useState } from 'react';
import { CartesianGrid, Label, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

import {
  A2UI_GRID,
  A2UI_PALETTE,
  A2uiFrame,
  a2uiPaletteAt,
  A2uiPlacedTooltip,
  a2uiStyles,
  A2uiTooltip,
  A2uiXTick,
  A2uiYTick,
  AXIS_TITLE,
  type ChartNumberFormat,
  createTickFormatter,
  createValueFormatter,
  formatNumber,
  niceScale,
  rightMarginFor,
  useElementWidth,
  Y_TICK_PADDING,
  yAxisWidthFor,
} from '@/common/a2ui';
import type { EventProps } from '@/common/BaseChartProps';
import type { ScatterChartValueFormatter } from '@/types/charts';

export interface A2uiScatterChartProps {
  category: string;
  className?: string;
  colors?: string[];
  currency?: string;
  customCategories?: Record<string, string>;
  data: any[];
  format?: ChartNumberFormat;
  height?: number | string;
  label?: string;
  loading?: boolean;
  noDataText?: ReactNode;
  onValueChange?: (value: EventProps) => void;
  ref?: Ref<HTMLElement>;
  showAnimation?: boolean;
  showGridLines?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  size?: string;
  style?: CSSProperties;
  subtitle?: string;
  title?: string;
  unit?: string;
  valueFormatter?: ScatterChartValueFormatter;
  x: string;
  xAxisLabel?: string;
  y: string;
  yAxisLabel?: string;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const FALLBACK_SERIES = 'Value';
const seriesOfRow = (d: any, category: string): string => {
  const s = d?.[category];
  return typeof s === 'string' && s ? s : FALLBACK_SERIES;
};
const TOP = 9;
const BOTTOM = 22.8;
/** Room for the x axis title under the ticks, and for the rotated y axis title. */
const X_TITLE = 16.8;
const Y_TITLE = 18;

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `ScatterChart`.
const A2uiScatterChart = ({
  data = [],
  x,
  y,
  size,
  category,
  label,
  colors = A2UI_PALETTE,
  format,
  currency,
  unit,
  valueFormatter,
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
  xAxisLabel,
  yAxisLabel,
  customCategories,
  onValueChange,
  className,
  style,
  ref,
}: A2uiScatterChartProps) => {
  const [plotRef, width, fontFamily] = useElementWidth();
  const [active, setActive] = useState<string | undefined>();
  const plotHeight = typeof height === 'number' ? height : 260;

  const rows = useMemo(() => data.filter((d) => isNum(d?.[x]) && isNum(d?.[y])), [data, x, y]);
  const seriesOf = (d: any) => seriesOfRow(d, category);
  const names = useMemo(
    () => Array.from(new Set(rows.map((d) => seriesOfRow(d, category)))),
    [rows, category],
  );
  const colorOf = (name: string) => a2uiPaletteAt(Math.max(0, names.indexOf(name)), colors);
  const labelOf = (name: string) => customCategories?.[name] ?? name;

  const formatY = useMemo(
    () => valueFormatter?.y ?? createValueFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );
  const formatX = useMemo(
    () => valueFormatter?.x ?? ((v: unknown) => formatNumber(v)),
    [valueFormatter],
  );
  const formatSize = useMemo(
    () => valueFormatter?.size ?? ((v: unknown) => formatNumber(v, 'compact')),
    [valueFormatter],
  );
  const tickY = useMemo(
    () => valueFormatter?.y ?? createTickFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );
  const tickX = useMemo(() => valueFormatter?.x ?? createTickFormatter(), [valueFormatter]);

  const xScale = useMemo(() => niceScale(rows.map((d) => d[x])), [rows, x]);
  const yScale = useMemo(() => niceScale(rows.map((d) => d[y])), [rows, y]);

  const maxSize = useMemo(
    () => Math.max(0, ...rows.map((d) => (size && isNum(d[size]) && d[size] >= 0 ? d[size] : 0))),
    [rows, size],
  );
  const radiusOf = (d: any) => {
    const s = size ? d?.[size] : undefined;
    return !isNum(s) || s < 0 || maxSize === 0 ? 5 : 3.5 + Math.sqrt(s / maxSize) * 11;
  };

  const yLabels = yScale.ticks.map((t) => tickY(t));
  const left = showYAxis
    ? yAxisWidthFor(yLabels, yAxisLabel ? Y_TITLE : 0, fontFamily) + Y_TICK_PADDING
    : 4;
  const lastX = tickX(xScale.ticks.at(-1) ?? 0);
  const right = showXAxis ? rightMarginFor(lastX, 0, fontFamily) : 4;
  const bottom = showXAxis ? BOTTOM + (xAxisLabel ? X_TITLE : 0) : 4;

  const empty = !loading && rows.length === 0;

  const renderTooltip = ({ active: isActive, payload, coordinate }: any) => {
    const d = payload?.[0]?.payload;
    if (!isActive || !d) return null;
    const series = seriesOf(d);
    const pointLabel = label ? d[label] : undefined;
    return (
      <A2uiPlacedTooltip
        height={plotHeight}
        prefer="side"
        width={width}
        x={coordinate?.x ?? 0}
        y={coordinate?.y ?? 0}
      >
        <A2uiTooltip
          title={pointLabel ?? (names.length > 1 ? labelOf(series) : undefined)}
          rows={[
            { color: colorOf(series), label: xAxisLabel ?? 'x', value: formatX(d[x]) },
            { label: yAxisLabel ?? 'y', value: formatY(d[y]) },
            ...(size && isNum(d[size]) ? [{ label: 'Size', value: formatSize(d[size]) }] : []),
          ]}
        />
      </A2uiPlacedTooltip>
    );
  };

  const keyOf = (name: string, d: any) => `${name}:${d?.[x]}:${d?.[y]}`;
  const renderDot = (name: string) => (props: any) => {
    const { cx, cy, payload } = props;
    if (!isNum(cx) || !isNum(cy)) return <g />;
    const isActive = active === keyOf(name, payload);
    const r = radiusOf(payload);
    return (
      <g
        opacity={active && !isActive ? 0.45 : 1}
        style={onValueChange ? { cursor: 'pointer' } : undefined}
        onClick={
          onValueChange
            ? () => onValueChange({ categoryClicked: name, eventType: 'bubble', ...payload })
            : undefined
        }
      >
        <circle cx={cx} cy={cy} fill={colorOf(name)} fillOpacity={isActive ? 0.95 : 0.55} r={r} />
        {isActive ? (
          <circle
            cx={cx}
            cy={cy}
            fill="var(--a2-surface)"
            r={Math.min(4.5, r * 0.4)}
            stroke={colorOf(name)}
            strokeWidth={2}
          />
        ) : null}
      </g>
    );
  };

  return (
    <A2uiFrame
      className={className}
      empty={empty}
      emptyText={noDataText}
      ref={ref}
      style={style}
      subtitle={subtitle}
      title={title}
      legend={
        showLegend
          ? names.map((name) => ({ color: colorOf(name), label: labelOf(name) }))
          : undefined
      }
    >
      <div className={a2uiStyles.plot} ref={plotRef} style={{ height: plotHeight }}>
        {loading ? (
          <Skeleton height={plotHeight} width={'100%'} />
        ) : width > 0 ? (
          <ScatterChart
            height={plotHeight}
            margin={{ bottom: 0, left: 0, right, top: TOP }}
            width={width}
          >
            {showGridLines && <CartesianGrid {...A2UI_GRID} horizontal vertical />}
            <XAxis
              axisLine={false}
              dataKey={x}
              domain={xScale.domain}
              height={bottom}
              hide={!showXAxis}
              interval={0}
              tick={<A2uiXTick formatter={tickX} />}
              tickLine={false}
              tickMargin={0}
              tickSize={0}
              ticks={xScale.ticks}
              type="number"
            >
              {xAxisLabel && (
                <Label
                  {...AXIS_TITLE}
                  content={({ viewBox }: any) => (
                    <text
                      {...AXIS_TITLE}
                      dominantBaseline="hanging"
                      textAnchor="middle"
                      x={viewBox.x + viewBox.width / 2}
                      y={viewBox.y + BOTTOM + 2.4}
                    >
                      {xAxisLabel}
                    </text>
                  )}
                />
              )}
            </XAxis>
            <YAxis
              axisLine={false}
              dataKey={y}
              domain={yScale.domain}
              hide={!showYAxis}
              interval={0}
              tick={<A2uiYTick formatter={tickY} />}
              tickLine={false}
              tickMargin={Y_TICK_PADDING}
              tickSize={0}
              ticks={yScale.ticks}
              type="number"
              width={left}
            >
              {yAxisLabel && (
                <Label
                  content={({ viewBox }: any) => {
                    const cy = viewBox.y + viewBox.height / 2;
                    return (
                      <text
                        {...AXIS_TITLE}
                        dominantBaseline="middle"
                        textAnchor="middle"
                        transform={`rotate(-90 9 ${cy})`}
                        x={9}
                        y={cy}
                      >
                        {yAxisLabel}
                      </text>
                    );
                  }}
                />
              )}
            </YAxis>
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
            {names.map((name) => (
              <Scatter
                animationDuration={900}
                data={rows.filter((d) => seriesOf(d) === name)}
                fill={colorOf(name)}
                isAnimationActive={showAnimation}
                key={name}
                name={name}
                shape={renderDot(name)}
                onMouseEnter={(entry: any) => setActive(keyOf(name, entry?.payload))}
                onMouseLeave={() => setActive(undefined)}
              />
            ))}
          </ScatterChart>
        ) : null}
      </div>
    </A2uiFrame>
  );
};

A2uiScatterChart.displayName = 'A2uiScatterChart';

export default A2uiScatterChart;
