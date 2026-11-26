'use client';

import { Skeleton } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from 'recharts';

import {
  A2UI_PALETTE,
  A2uiFrame,
  a2uiPaletteAt,
  A2uiPlacedTooltip,
  a2uiStyles,
  A2uiTooltip,
  type ChartNumberFormat,
  createValueFormatter,
  shortLabel,
  useElementWidth,
} from '@/common/a2ui';
import type { EventProps } from '@/common/BaseChartProps';
import type { ValueFormatter } from '@/types/charts';

export interface A2uiRadarChartProps {
  angleAxisLabelFormatter?: (value: string | number, payload?: Record<string, any>) => ReactNode;
  categories: string[];
  className?: string;
  colors?: string[];
  currency?: string;
  customCategories?: Record<string, string>;
  data: any[];
  fillOpacity?: number;
  format?: ChartNumberFormat;
  height?: number | string;
  index: string;
  loading?: boolean;
  maxValue?: number;
  noDataText?: ReactNode;
  onValueChange?: (value: EventProps) => void;
  ref?: Ref<HTMLElement>;
  showAnimation?: boolean;
  showGridLines?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  style?: CSSProperties;
  subtitle?: string;
  title?: string;
  unit?: string;
  valueFormatter?: ValueFormatter;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const MARGIN = 4;
const RADIUS_RATIO = 0.78;
const LABEL_OFFSET = 12;
const INK = 'oklch(var(--a2-ink))';

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `RadarChart`.
const A2uiRadarChart = ({
  data = [],
  index,
  categories = [],
  colors = A2UI_PALETTE,
  fillOpacity = 0.2,
  format,
  currency,
  unit,
  valueFormatter,
  angleAxisLabelFormatter,
  title,
  subtitle,
  height,
  loading,
  noDataText,
  maxValue,
  showAnimation = false,
  showGridLines = true,
  showLegend = true,
  showTooltip = true,
  customCategories,
  onValueChange,
  className,
  style,
  ref,
}: A2uiRadarChartProps) => {
  const [plotRef, width] = useElementWidth();
  const plotHeight = typeof height === 'number' ? height : 280;
  const names = categories;
  const colorOf = (name: string) => a2uiPaletteAt(Math.max(0, names.indexOf(name)), colors);
  const labelOf = (name: string) => customCategories?.[name] ?? name;
  const formatValue = useMemo(
    () => valueFormatter ?? createValueFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );

  const max = useMemo(() => {
    if (isNum(maxValue) && maxValue > 0) return maxValue;
    const values = data.flatMap((d) => names.map((n) => d?.[n]).filter(isNum));
    return Math.max(1, ...values);
  }, [data, names, maxValue]);

  const radius = (Math.min(width, plotHeight - MARGIN * 2) / 2) * RADIUS_RATIO;
  const count = data.length;
  const empty = !loading && (count < 3 || names.length === 0);

  // Spokes are drawn with the labels: recharts' PolarGrid has no spokes-only mode.
  const renderAngleTick = ({ cx, cy, payload, index: i }: any) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * (i ?? payload?.index ?? 0)) / Math.max(1, count);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const r = radius + LABEL_OFFSET;
    const anchor = Math.abs(cos) < 1e-6 ? 'middle' : cos > 0 ? 'start' : 'end';
    const baseline = sin > 1e-6 ? 'hanging' : 'auto';
    const value = payload?.value;
    const row = data.find((d) => d?.[index] === value);
    return (
      <g>
        {showGridLines && (
          <line
            stroke={INK}
            strokeOpacity={0.07}
            x1={cx}
            x2={cx + radius * cos}
            y1={cy}
            y2={cy + radius * sin}
          />
        )}
        <text
          dominantBaseline={baseline}
          fill="var(--a2-chart-muted)"
          fontSize={12}
          textAnchor={anchor}
          x={cx + r * cos}
          y={cy + r * sin}
        >
          {angleAxisLabelFormatter ? angleAxisLabelFormatter(value, row) : shortLabel(value, 16)}
        </text>
      </g>
    );
  };

  const renderTooltip = ({ active, payload, label, coordinate }: any) => {
    if (!active || !payload?.length) return null;
    const items = (payload as any[]).filter((p) => names.includes(String(p.dataKey)));
    return (
      <A2uiPlacedTooltip
        height={plotHeight}
        width={width}
        x={coordinate?.x ?? 0}
        y={coordinate?.y ?? 0}
      >
        <A2uiTooltip
          title={String(label ?? items[0]?.payload?.[index] ?? '')}
          rows={items.map((p) => ({
            color: colorOf(String(p.dataKey)),
            label: labelOf(String(p.dataKey)),
            value: formatValue(p.value),
          }))}
        />
      </A2uiPlacedTooltip>
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
          <RadarChart
            cx="50%"
            cy="50%"
            data={data}
            height={plotHeight}
            margin={{ bottom: MARGIN, left: 0, right: 0, top: MARGIN }}
            outerRadius={radius}
            width={width}
            onClick={
              onValueChange
                ? (state: any) =>
                    state?.activePayload?.[0]
                      ? onValueChange({
                          categoryClicked: String(state.activeLabel ?? ''),
                          eventType: 'dot',
                          ...state.activePayload[0].payload,
                        })
                      : onValueChange(null)
                : undefined
            }
          >
            {showGridLines && (
              <PolarGrid
                gridType="polygon"
                polarRadius={[0.25, 0.5, 0.75, 1].map((f) => f * radius)}
                radialLines={false}
                stroke={INK}
                strokeOpacity={0.08}
              />
            )}
            <PolarAngleAxis
              axisLine={false}
              dataKey={index}
              tick={renderAngleTick}
              tickLine={false}
            />
            <PolarRadiusAxis axisLine={false} domain={[0, max]} tick={false} tickCount={2} />
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
              <Radar
                animationDuration={900}
                dataKey={name}
                dot={{ fill: colorOf(name), fillOpacity: 1, r: 2.75, stroke: 'none' }}
                fill={colorOf(name)}
                fillOpacity={fillOpacity}
                isAnimationActive={showAnimation}
                key={name}
                name={name}
                stroke={colorOf(name)}
                strokeLinejoin="round"
                strokeWidth={1.75}
                activeDot={{
                  fill: 'var(--a2-surface)',
                  r: 4.5,
                  stroke: colorOf(name),
                  strokeWidth: 2,
                }}
              />
            ))}
          </RadarChart>
        ) : null}
      </div>
    </A2uiFrame>
  );
};

A2uiRadarChart.displayName = 'A2uiRadarChart';

export default A2uiRadarChart;
