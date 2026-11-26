'use client';

import { Skeleton } from '@lobehub/ui';
import type { CSSProperties, MouseEvent, ReactNode, Ref } from 'react';
import { useMemo } from 'react';

import {
  A2UI_NEGATIVE,
  A2UI_POSITIVE,
  A2uiFloatingTooltip,
  a2uiStyles,
  type ChartNumberFormat,
  ChartShell,
  type ChartVariant,
  createTickFormatter,
  createValueFormatter,
  lookOf,
  measureTextWidth,
  niceScale,
  rightMarginFor,
  shortLabel,
  useA2uiHover,
  useElementWidth,
  Y_TICK_PADDING,
  yAxisWidthFor,
} from '@/common/a2ui';
import type { ValueFormatter } from '@/types/charts';

import { styles } from './styles';
import { type Candle, parseCandles, periodChange, thinLabels } from './utils';

export interface CandlestickChartProps {
  className?: string;
  /**
   * ISO 4217 code used when `format` is `currency`.
   * @default 'USD'
   */
  currency?: string;
  /** Rows of `{ [index], open, high, low, close }`. */
  data: any[];
  /** How prices read on the axis, the header and the tooltip. */
  format?: ChartNumberFormat;
  /**
   * Plot height in px.
   * @default 240
   */
  height?: number;
  /**
   * Key of the period label (x axis).
   * @default 'date'
   */
  index?: string;
  loading?: boolean;
  noDataText?: ReactNode;
  ref?: Ref<HTMLElement>;
  /**
   * Show the last close and the change over the period at the top right.
   * @default true
   */
  showSummary?: boolean;
  /**
   * @default true
   */
  showTooltip?: boolean;
  style?: CSSProperties;
  /** Secondary line under the title (a2ui only). */
  subtitle?: string;
  /** Card title (a2ui only). */
  title?: string;
  /** Unit appended to prices. */
  unit?: string;
  /** Formats prices; wins over `format`. */
  valueFormatter?: ValueFormatter;
  /**
   * Visual style: `default` sits with the other lobe charts; `a2ui` draws the A2UI card.
   * @default 'default'
   */
  variant?: ChartVariant;
}

const TOP = 10;
const BOTTOM = 22.8;
const BAND_PADDING = 0.36;

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `CandlestickChart`.
const CandlestickChart = ({
  data = [],
  index = 'date',
  format,
  currency = 'USD',
  unit,
  valueFormatter,
  title,
  subtitle,
  height = 240,
  loading,
  noDataText,
  showSummary = true,
  showTooltip = true,
  variant = 'default',
  className,
  style,
  ref,
}: CandlestickChartProps) => {
  const look = lookOf(variant);
  const fontSize = look.tick.fontSize;
  const [plotRef, width, fontFamily] = useElementWidth();
  const { hover, setHover } = useA2uiHover<Candle>();
  const candles = useMemo(() => parseCandles(data, index), [data, index]);
  const formatValue = useMemo(
    () => valueFormatter ?? createValueFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );
  const formatTick = useMemo(
    () => valueFormatter ?? createTickFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );

  const { domain, ticks } = useMemo(
    () => niceScale(candles.flatMap((c) => [c.low, c.high])),
    [candles],
  );
  const labels = candles.map((c) => shortLabel(c.date, 8));
  const left =
    yAxisWidthFor(
      ticks.map((t) => formatTick(t)),
      0,
      fontFamily,
      fontSize,
    ) + Y_TICK_PADDING;
  const n = candles.length;
  // Keep the last date label inside the card: the plot ends where that label still fits.
  let right = 4;
  for (let i = 0; i < 2 && n > 0; i++) {
    const s = (width - left - right) / (n + BAND_PADDING);
    right = rightMarginFor(
      labels[n - 1],
      s * BAND_PADDING + (s * (1 - BAND_PADDING)) / 2,
      fontFamily,
      fontSize,
    );
  }
  const plotW = Math.max(0, width - left - right);
  const plotH = Math.max(0, height - TOP - BOTTOM - (fontSize - 11));
  const step = n > 0 ? plotW / (n + BAND_PADDING) : 0;
  const bw = step * (1 - BAND_PADDING);
  const xAt = (i: number) => left + step * BAND_PADDING + step * i + bw / 2;
  const [d0, d1] = domain;
  const yAt = (v: number) => TOP + plotH - ((v - d0) / (d1 - d0 || 1)) * plotH;
  const minBody = (d1 - d0 || 1) * 0.006;

  const visibleLabels = new Set(
    thinLabels(
      candles.map((_, i) => xAt(i)),
      labels.map((l) =>
        measureTextWidth(l, `${fontSize}px ${fontFamily ?? 'sans-serif'}`, fontSize),
      ),
      5,
    ),
  );

  const last = candles.at(-1);
  const change = periodChange(candles);
  const toneOf = (c: Candle) => (c.dir === 'up' ? A2UI_POSITIVE : A2UI_NEGATIVE);

  const summary =
    showSummary && last ? (
      <div className={styles.summary}>
        <div className={styles.last}>{formatValue(last.close)}</div>
        <div
          className={styles.change}
          style={{ color: change >= 0 ? A2UI_POSITIVE : A2UI_NEGATIVE }}
        >
          {change >= 0 ? '+' : ''}
          {change.toFixed(2)}% over period
        </div>
      </div>
    ) : undefined;

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!showTooltip || n === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = Math.max(
      0,
      Math.min(n - 1, Math.floor((px - left - (step * BAND_PADDING) / 2) / step)),
    );
    setHover({ datum: candles[i], x: px, y: e.clientY - rect.top });
  };

  const hovered = hover?.datum;
  const hoveredChange =
    hovered && hovered.open ? ((hovered.close - hovered.open) / hovered.open) * 100 : 0;

  return (
    <ChartShell
      aside={summary}
      className={className}
      empty={!loading && n === 0}
      emptyText={noDataText}
      ref={ref}
      style={style}
      subtitle={subtitle}
      title={title}
      variant={variant}
    >
      <div className={a2uiStyles.plot} ref={plotRef} style={{ height }}>
        {loading ? (
          <Skeleton height={height} width={'100%'} />
        ) : width > 0 ? (
          <svg
            aria-label={title ?? 'Candlestick chart'}
            height={height}
            role="img"
            style={{ display: 'block', overflow: 'visible' }}
            width={width}
            onMouseLeave={() => setHover(undefined)}
            onMouseMove={onMove}
          >
            <g {...look.grid}>
              {ticks.map((t) => (
                <line key={t} x1={left} x2={left + plotW} y1={yAt(t)} y2={yAt(t)} />
              ))}
            </g>
            {ticks.map((t) => (
              <text
                key={`y-${t}`}
                {...look.tick}
                dominantBaseline="middle"
                textAnchor={look.yAlign === 'edge' ? 'start' : 'end'}
                x={look.yAlign === 'edge' ? 0 : left - Y_TICK_PADDING}
                y={yAt(t)}
              >
                {formatTick(t)}
              </text>
            ))}
            {candles.map((c, i) =>
              visibleLabels.has(i) ? (
                <text
                  key={`x-${c.date}-${i}`}
                  {...look.tick}
                  textAnchor="middle"
                  x={xAt(i)}
                  y={TOP + plotH + look.xBaseline}
                >
                  {labels[i]}
                </text>
              ) : null,
            )}
            {candles.map((c, i) => {
              const x = xAt(i);
              const bodyEnd =
                Math.abs(c.close - c.open) < minBody
                  ? c.open + (c.dir === 'up' ? minBody : -minBody)
                  : c.close;
              const y0 = yAt(Math.max(c.open, bodyEnd));
              const y1 = yAt(Math.min(c.open, bodyEnd));
              return (
                <g key={`${c.date}-${i}`}>
                  <line
                    stroke={toneOf(c)}
                    strokeLinecap="round"
                    strokeWidth={1.25}
                    x1={x}
                    x2={x}
                    y1={yAt(c.low)}
                    y2={yAt(c.high)}
                  />
                  <rect
                    fill={toneOf(c)}
                    height={Math.max(1, y1 - y0)}
                    rx={1.5}
                    width={bw}
                    x={x - bw / 2}
                    y={y0}
                  />
                </g>
              );
            })}
          </svg>
        ) : null}
        {showTooltip && hovered ? (
          <A2uiFloatingTooltip
            height={height}
            title={hovered.date}
            variant={variant}
            width={width}
            x={xAt(candles.indexOf(hovered))}
            y={(yAt(hovered.open) + yAt(hovered.close)) / 2}
            rows={[
              { label: 'Open', value: formatValue(hovered.open) },
              { label: 'High', value: formatValue(hovered.high) },
              { label: 'Low', value: formatValue(hovered.low) },
              { color: toneOf(hovered), label: 'Close', value: formatValue(hovered.close) },
              {
                active: true,
                color: toneOf(hovered),
                label: 'Change',
                value: `${hoveredChange >= 0 ? '+' : ''}${hoveredChange.toFixed(2)}%`,
              },
            ]}
          />
        ) : null}
      </div>
    </ChartShell>
  );
};

CandlestickChart.displayName = 'CandlestickChart';

export default CandlestickChart;
