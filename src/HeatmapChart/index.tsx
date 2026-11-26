'use client';

import { Skeleton } from '@lobehub/ui';
import type { CSSProperties, MouseEvent, ReactNode, Ref } from 'react';
import { useMemo } from 'react';

import {
  A2UI_TICK,
  A2uiFloatingTooltip,
  A2uiFrame,
  a2uiStyles,
  type ChartNumberFormat,
  createValueFormatter,
  formatNumber,
  useA2uiHover,
  useElementWidth,
  Y_TICK_PADDING,
  yAxisWidthFor,
} from '@/common/a2ui';
import type { ValueFormatter } from '@/types/charts';

import { styles } from './styles';
import { heatColor, type HeatmapCell, heatRatio, parseHeatmap } from './utils';

export interface HeatmapChartProps {
  className?: string;
  /**
   * Colour of the high end of the ramp. The low end is the surface tint.
   * @default 'var(--a2-chart-1)'
   */
  color?: string;
  /**
   * ISO 4217 code used when `format` is `currency`.
   * @default 'USD'
   */
  currency?: string;
  /** Rows of `{ x, y, value }`; keys are set by `x`, `y` and `value`. */
  data: any[];
  /** How values read in cells, the legend and the tooltip. `percent` expects 0-100. */
  format?: ChartNumberFormat;
  /** Plot height in px. Defaults to 30px per row plus the axis, between 150 and 320. */
  height?: number;
  loading?: boolean;
  noDataText?: ReactNode;
  ref?: Ref<HTMLElement>;
  /**
   * Show the min-to-max ramp at the top right.
   * @default true
   */
  showLegend?: boolean;
  /**
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Print values in cells. Defaults to on when the grid has at most 48 cells and 12 columns.
   */
  showValues?: boolean;
  style?: CSSProperties;
  /** Secondary line under the title. */
  subtitle?: string;
  /** Card title. */
  title?: string;
  /** Unit appended to values. */
  unit?: string;
  /**
   * Key of the cell value.
   * @default 'value'
   */
  value?: string;
  /** Formats values; wins over `format`. */
  valueFormatter?: ValueFormatter;
  /**
   * Key of the column category.
   * @default 'x'
   */
  x?: string;
  /**
   * Key of the row category.
   * @default 'y'
   */
  y?: string;
}

const TOP = 4;
const RIGHT = 4;
/** x tick baseline sits 14.8px under the plot (6px padding). */
const X_BASELINE = 14.8;
const BOTTOM = 18.8;
const INSET = 1.5;

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `Heatmap`.
const HeatmapChart = ({
  data = [],
  x = 'x',
  y = 'y',
  value = 'value',
  color = 'var(--a2-chart-1)',
  format,
  currency = 'USD',
  unit,
  valueFormatter,
  title,
  subtitle,
  height,
  loading,
  noDataText,
  showLegend = true,
  showTooltip = true,
  showValues,
  className,
  style,
  ref,
}: HeatmapChartProps) => {
  const [plotRef, width, fontFamily] = useElementWidth();
  const { hover, setHover } = useA2uiHover<HeatmapCell>();
  const { cells, xs, ys, min, max } = useMemo(
    () => parseHeatmap(data, x, y, value),
    [data, x, y, value],
  );
  const plotHeight = height ?? Math.min(320, Math.max(150, ys.length * 30 + 36));
  const formatValue = useMemo(
    () => valueFormatter ?? createValueFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );
  const formatCell = (v: number) =>
    valueFormatter
      ? valueFormatter(v)
      : formatNumber(v, format === 'currency' ? 'compact' : (format ?? 'compact'));
  const formatRange = (v: number) =>
    valueFormatter
      ? valueFormatter(v)
      : formatNumber(v, format === 'currency' ? 'currency' : 'compact', unit, currency);

  const left = yAxisWidthFor(ys, 0, fontFamily) + Y_TICK_PADDING;
  const plotWidth = Math.max(0, width - left - RIGHT);
  const plotH = Math.max(0, plotHeight - TOP - BOTTOM);
  const bw = xs.length > 0 ? plotWidth / xs.length : 0;
  const bh = ys.length > 0 ? plotH / ys.length : 0;
  const texts = showValues ?? (xs.length * ys.length <= 48 && xs.length <= 12);
  const empty = !loading && cells.length === 0;

  // Hit-test by band, as the official chart does, so the gaps between cells keep the focus.
  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const xi = Math.floor((px - left) / (bw || 1));
    const yi = Math.floor((py - TOP) / (bh || 1));
    const cell =
      xi >= 0 && yi >= 0 && xi < xs.length && yi < ys.length
        ? cells.find((c) => c.x === xs[xi] && c.y === ys[yi])
        : undefined;
    if (cell !== hover?.datum) setHover(cell ? { datum: cell, x: px, y: py } : undefined);
  };

  const legend =
    showLegend && cells.length > 0 ? (
      <div className={styles.legend}>
        <span>{formatRange(min)}</span>
        <span
          className={styles.ramp}
          style={{
            background: `linear-gradient(90deg, color-mix(in oklch, ${color} 6%, var(--a2-heat-legend-low)), ${color})`,
          }}
        />
        <span>{formatRange(max)}</span>
      </div>
    ) : undefined;

  return (
    <A2uiFrame
      aside={legend}
      className={className}
      empty={empty}
      emptyText={noDataText}
      ref={ref}
      style={style}
      subtitle={subtitle}
      title={title}
    >
      <div className={a2uiStyles.plot} ref={plotRef} style={{ height: plotHeight }}>
        {loading ? (
          <Skeleton height={plotHeight} width={'100%'} />
        ) : width > 0 ? (
          <svg
            aria-label={title ?? 'Heatmap'}
            height={plotHeight}
            role="img"
            style={{ display: 'block', overflow: 'visible' }}
            width={width}
            onMouseLeave={() => setHover(undefined)}
            onMouseMove={showTooltip ? onMove : undefined}
          >
            {ys.map((row, i) => (
              <text
                key={`y-${row}`}
                {...A2UI_TICK}
                dominantBaseline="middle"
                textAnchor="end"
                x={left - Y_TICK_PADDING}
                y={TOP + bh * (i + 0.5)}
              >
                {row}
              </text>
            ))}
            {xs.map((col, i) => (
              <text
                key={`x-${col}`}
                {...A2UI_TICK}
                textAnchor="middle"
                x={left + bw * (i + 0.5)}
                y={TOP + plotH + X_BASELINE}
              >
                {col}
              </text>
            ))}
            {cells.map((cell) => {
              const t = heatRatio(cell.value, min, max);
              const xi = xs.indexOf(cell.x);
              const yi = ys.indexOf(cell.y);
              const active = hover?.datum === cell;
              return (
                <g key={`${cell.y}\u0000${cell.x}`}>
                  <rect
                    fill={heatColor(t, color)}
                    height={Math.max(0, bh - INSET * 2)}
                    rx={4}
                    stroke={active ? 'var(--a2-chart-focus)' : undefined}
                    strokeWidth={active ? 1.5 : undefined}
                    width={Math.max(0, bw - INSET * 2)}
                    x={left + bw * xi + INSET}
                    y={TOP + bh * yi + INSET}
                  />
                  {texts ? (
                    <text
                      dominantBaseline="middle"
                      fill={t > 0.55 ? 'var(--a2-heat-ink-hi)' : 'var(--a2-heat-ink-lo)'}
                      fontSize={10.5}
                      fontWeight={600}
                      pointerEvents="none"
                      textAnchor="middle"
                      x={left + bw * (xi + 0.5)}
                      y={TOP + bh * (yi + 0.5)}
                    >
                      {formatCell(cell.value)}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        ) : null}
        {showTooltip && hover ? (
          <A2uiFloatingTooltip
            height={plotHeight}
            title={`${hover.datum.y} · ${hover.datum.x}`}
            width={width}
            x={left + bw * (xs.indexOf(hover.datum.x) + 0.5)}
            y={TOP + bh * (ys.indexOf(hover.datum.y) + 0.5)}
            rows={[
              {
                color: heatColor(heatRatio(hover.datum.value, min, max), color),
                label: 'Value',
                value: formatValue(hover.datum.value),
              },
            ]}
          />
        ) : null}
      </div>
    </A2uiFrame>
  );
};

HeatmapChart.displayName = 'HeatmapChart';

export default HeatmapChart;
