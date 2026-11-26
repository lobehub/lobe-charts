'use client';

import { Skeleton } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import {
  A2UI_PALETTE,
  A2uiFrame,
  a2uiPaletteAt,
  A2uiPlacedTooltip,
  A2uiTooltip,
  type ChartNumberFormat,
  createValueFormatter,
  formatNumber,
  summaryFormat,
} from '@/common/a2ui';
import type { EventProps, ValueFormatter } from '@/types/charts';

import { a2uiStyles as styles } from './a2uiStyles';

export interface A2uiDonutChartProps {
  category: string;
  centerLabel?: string;
  className?: string;
  colors?: string[];
  currency?: string;
  customCategories?: Record<string, string>;
  data: any[];
  donut?: boolean;
  format?: ChartNumberFormat;
  index: string;
  label?: string;
  loading?: boolean;
  noDataText?: ReactNode;
  onValueChange?: (value: EventProps) => void;
  ref?: Ref<HTMLElement>;
  showAnimation?: boolean;
  showLabel?: boolean;
  showTooltip?: boolean;
  size?: number;
  style?: CSSProperties;
  subtitle?: string;
  title?: string;
  unit?: string;
  valueFormatter?: ValueFormatter;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
/** Polar inset, inner radius ratio and the gap between slices (radians) of the official pie. */
const INSET = 6;
const INNER = 0.64;
const GAP = 0.025;

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `PieChart`.
const A2uiDonutChart = ({
  data = [],
  category,
  index,
  colors = A2UI_PALETTE,
  donut = true,
  centerLabel = 'Total',
  label,
  showLabel = true,
  format,
  currency,
  unit,
  valueFormatter,
  title,
  subtitle,
  size = 200,
  loading,
  noDataText,
  showAnimation = false,
  showTooltip = true,
  customCategories,
  onValueChange,
  className,
  style,
  ref,
}: A2uiDonutChartProps) => {
  const [hover, setHover] = useState<number | undefined>();
  const rows = useMemo(
    () =>
      data
        .filter((d) => isNum(d?.[category]) && d[category] >= 0)
        .map((d) => ({ ...d, name: String(d?.[index] ?? '') })),
    [data, category, index],
  );
  const total = rows.reduce((s, r) => s + r[category], 0);
  const colorAt = (i: number) => a2uiPaletteAt(i, colors);
  const labelOf = (name: string) => customCategories?.[name] ?? name;
  const formatValue = useMemo(
    () => valueFormatter ?? createValueFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );
  const formatTotal = (v: number) =>
    valueFormatter ? valueFormatter(v) : formatNumber(v, summaryFormat(format), unit, currency);
  const formatItem = (v: number) =>
    valueFormatter
      ? valueFormatter(v)
      : format === 'currency'
        ? formatNumber(v, 'currency', undefined, currency)
        : formatNumber(v, 'compact', unit);

  const outer = size / 2 - INSET;
  const inner = donut ? outer * INNER : 0;
  const empty = !loading && (rows.length === 0 || total <= 0);

  const renderTooltip = ({ active, payload, coordinate }: any) => {
    const p = payload?.[0];
    if (!active || !p) return null;
    const i = rows.findIndex((r) => r.name === p.payload?.name);
    const value = p.payload?.[category];
    return (
      <A2uiPlacedTooltip height={size} width={size} x={coordinate?.x ?? 0} y={coordinate?.y ?? 0}>
        <A2uiTooltip
          title={labelOf(p.payload?.name)}
          rows={[
            { color: colorAt(i), label: 'Value', value: formatValue(value) },
            { label: 'Share', value: `${((value / (total || 1)) * 100).toFixed(1)}%` },
          ]}
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
    >
      <div className={styles.body}>
        <div className={styles.chart} style={{ height: size, width: size }}>
          {loading ? (
            <Skeleton height={size} width={size} />
          ) : (
            <PieChart height={size} margin={{ bottom: 0, left: 0, right: 0, top: 0 }} width={size}>
              <Pie
                animationDuration={900}
                cornerRadius={donut ? 4 : 2}
                cx="50%"
                cy="50%"
                data={rows}
                dataKey={category}
                endAngle={-270}
                innerRadius={inner}
                isAnimationActive={showAnimation}
                nameKey="name"
                outerRadius={outer}
                paddingAngle={rows.length > 1 ? (GAP * 180) / Math.PI : 0}
                startAngle={90}
                stroke="none"
                style={{ cursor: onValueChange ? 'pointer' : undefined, outline: 'none' }}
                onMouseEnter={(_: any, i: number) => setHover(i)}
                onMouseLeave={() => setHover(undefined)}
                onClick={
                  onValueChange
                    ? (entry: any) =>
                        onValueChange({ eventType: 'slice', ...entry?.payload?.payload } as any)
                    : undefined
                }
              >
                {rows.map((r, i) => (
                  <Cell
                    fill={colorAt(i)}
                    key={`${r.name}-${i}`}
                    opacity={hover !== undefined && hover !== i ? 0.35 : 1}
                  />
                ))}
              </Pie>
              {showTooltip && (
                <Tooltip
                  allowEscapeViewBox={{ x: true, y: true }}
                  content={renderTooltip}
                  isAnimationActive={false}
                  position={{ x: 0, y: 0 }}
                  wrapperStyle={{ height: 0, outline: 'none', width: 0, zIndex: 1 }}
                />
              )}
            </PieChart>
          )}
          {donut && showLabel && !loading ? (
            <div className={styles.center}>
              <div>
                <div className={styles.total}>{label ?? formatTotal(total)}</div>
                <div className={styles.centerLabel}>{centerLabel}</div>
              </div>
            </div>
          ) : null}
        </div>
        <ul className={styles.list}>
          {rows.map((r, i) => {
            const share = r[category] / (total || 1);
            return (
              <li
                className={styles.item}
                key={`${r.name}-${i}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(undefined)}
              >
                <span className={styles.swatch} style={{ background: colorAt(i) }} />
                <span className={styles.itemLabel}>{labelOf(r.name)}</span>
                <span className={styles.itemValue}>{formatItem(r[category])}</span>
                <span className={styles.itemPercent}>
                  {(share * 100).toFixed(share < 0.1 ? 1 : 0)}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </A2uiFrame>
  );
};

A2uiDonutChart.displayName = 'A2uiDonutChart';

export default A2uiDonutChart;
