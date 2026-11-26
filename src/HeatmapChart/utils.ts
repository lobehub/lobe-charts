export interface HeatmapCell {
  value: number;
  x: string;
  y: string;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Valid cells, plus x / y categories in first-seen order and the value extent. */
export const parseHeatmap = (data: any[], xKey: string, yKey: string, valueKey: string) => {
  const cells: HeatmapCell[] = [];
  for (const d of data ?? []) {
    const x = d?.[xKey];
    const y = d?.[yKey];
    const value = d?.[valueKey];
    if ((typeof x !== 'string' && !isNum(x)) || (typeof y !== 'string' && !isNum(y))) continue;
    if (!isNum(value)) continue;
    cells.push({ value, x: String(x), y: String(y) });
  }
  const xs = Array.from(new Set(cells.map((c) => c.x)));
  const ys = Array.from(new Set(cells.map((c) => c.y)));
  const values = cells.map((c) => c.value);
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 1;
  return { cells, max, min, xs, ys };
};

/** Position of a value in the ramp, 0-1. */
export const heatRatio = (value: number, min: number, max: number) => {
  const span = max - min || 1;
  return Math.max(0, Math.min(1, (value - min) / span));
};

/** Share of the ramp colour mixed into the empty colour, 4-100%. Eased so low values still read. */
export const heatPercent = (t: number) => Math.round(4 + Math.pow(t, 0.8) * 96);

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `Heatmap` shade.
export const heatColor = (t: number, color: string) =>
  `color-mix(in oklch, ${color} ${heatPercent(t)}%, var(--a2-heat-low))`;
