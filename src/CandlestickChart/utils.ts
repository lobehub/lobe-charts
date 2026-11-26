export interface Candle {
  close: number;
  date: string;
  dir: 'up' | 'down';
  high: number;
  low: number;
  open: number;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Valid OHLC rows; high / low are widened to cover open and close. */
export const parseCandles = (data: any[], index: string): Candle[] => {
  const out: Candle[] = [];
  for (const d of data ?? []) {
    const date = d?.[index];
    const { open, high, low, close } = d ?? {};
    if ((typeof date !== 'string' && !isNum(date)) || ![open, high, low, close].every(isNum))
      continue;
    out.push({
      close,
      date: String(date),
      dir: close >= open ? 'up' : 'down',
      high: Math.max(high, open, close),
      low: Math.min(low, open, close),
      open,
    });
  }
  return out;
};

/** Change from the first open to the last close, in percent. */
export const periodChange = (candles: Candle[]) => {
  const first = candles[0]?.open;
  const last = candles.at(-1)?.close;
  return first && last !== undefined ? ((last - first) / first) * 100 : 0;
};

/**
 * Indices of x labels to draw: greedily keeps labels that do not overlap the previous one, and always
 * keeps the last label (dropping the one before it if they collide).
 */
export const thinLabels = (centers: number[], widths: number[], gap = 8): number[] => {
  const keep: number[] = [];
  let lastRight = -Infinity;
  for (let i = 0; i < centers.length; i++) {
    const left = centers[i] - widths[i] / 2;
    if (left >= lastRight + gap) {
      keep.push(i);
      lastRight = centers[i] + widths[i] / 2;
    }
  }
  const last = centers.length - 1;
  if (last >= 0 && keep.at(-1) !== last) {
    while (keep.length > 0) {
      const prev = keep.at(-1)!;
      if (centers[prev] + widths[prev] / 2 + gap <= centers[last] - widths[last] / 2) break;
      keep.pop();
    }
    keep.push(last);
  }
  return keep;
};
