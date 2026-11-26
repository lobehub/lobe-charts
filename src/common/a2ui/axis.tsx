import type { ValueFormatter } from '@/types/charts';

import { estimateLabelWidth, measureTextWidth } from './scale';
import { A2UI_TICK } from './tokens';

/** Distance from the plot edge to a y tick label, and from the plot bottom to an x tick baseline. */
export const Y_TICK_PADDING = 8;
export const X_TICK_BASELINE = 16.8;

/** Width of an 11px tick label, measured in `fontFamily` when known, otherwise estimated. */
export const tickLabelWidth = (label: string, fontFamily?: string, fontSize = 11) =>
  fontFamily
    ? measureTextWidth(label, `${fontSize}px ${fontFamily}`, fontSize)
    : estimateLabelWidth(label, fontSize) - 2;

/**
 * Right edge of the y tick labels (the plot starts `Y_TICK_PADDING` further right): the widest label plus
 * a 4px gutter, plus `extra` for an axis title.
 */
export const yAxisWidthFor = (labels: string[], extra = 0, fontFamily?: string, fontSize = 11) =>
  4 + extra + Math.max(0, ...labels.map((l) => Math.ceil(tickLabelWidth(l, fontFamily, fontSize))));

/**
 * Right margin that keeps the last x label inside the chart: half the label past the point it is centred
 * on (`inset` from the plot's right edge), plus a 4px gutter; never less than 4px.
 */
export const rightMarginFor = (label: string, inset: number, fontFamily?: string, fontSize = 11) =>
  Math.max(4, tickLabelWidth(label, fontFamily, fontSize) / 2 - inset + 4);

interface TickProps {
  formatter?: ValueFormatter | ((v: any) => string);
  payload?: { value: any };
  x?: number | string;
  y?: number | string;
}

/** X tick: 11px muted label, baseline 16.8px under the plot. Render with `tickSize={0}`, `tickMargin={0}`. */
export const A2uiXTick = ({ x, y, payload, formatter }: TickProps) => (
  <text {...A2UI_TICK} textAnchor="middle" x={Number(x)} y={Number(y) + X_TICK_BASELINE}>
    {formatter ? formatter(payload?.value) : String(payload?.value ?? '')}
  </text>
);

/** Y tick: right-aligned, vertically centred. Render with `tickSize={0}`, `tickMargin={8}`. */
export const A2uiYTick = ({ x, y, payload, formatter }: TickProps) => (
  <text {...A2UI_TICK} dominantBaseline="middle" textAnchor="end" x={Number(x)} y={Number(y)}>
    {formatter ? formatter(payload?.value) : String(payload?.value ?? '')}
  </text>
);

/** Y tick for a category axis (horizontal bars). */
export const A2uiCategoryYTick = A2uiYTick;

/** Axis title, as official: 11px / 500 in the chart foreground at 76%. */
export const AXIS_TITLE = {
  fill: 'var(--a2-chart-fg)',
  fillOpacity: 0.76,
  fontSize: 11,
  fontWeight: 500,
} as const;
