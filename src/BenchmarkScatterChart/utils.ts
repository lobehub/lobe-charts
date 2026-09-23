export type ScaleType = 'linear' | 'log';

export interface Scale {
  domain: [number, number];
  map: (value: number) => number;
  ticks: number[];
}

const niceStep = (range: number, count: number) => {
  if (range <= 0 || !Number.isFinite(range)) return 1;
  const raw = range / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const base = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return base * magnitude;
};

export const getLinearTicks = (min: number, max: number, count = 5) => {
  const step = niceStep(max - min, count);
  const ticks: number[] = [];
  const start = Math.ceil(min / step) * step;
  for (let value = start; value <= max + step / 1e6; value += step) {
    ticks.push(Number(value.toPrecision(12)));
  }
  return ticks;
};

export const getLogTicks = (min: number, max: number) => {
  const ticks: number[] = [];
  const from = Math.floor(Math.log10(min));
  const to = Math.ceil(Math.log10(max));
  for (let exp = from; exp <= to; exp++) {
    for (const base of [1, 2, 5]) {
      const value = Number((base * 10 ** exp).toPrecision(12));
      if (value >= min && value <= max) ticks.push(value);
    }
  }
  return ticks;
};

export const createScale = ({
  values,
  type = 'linear',
  range,
  min,
  max,
  padding = 0.08,
  tickCount = 5,
}: {
  max?: number;
  min?: number;
  padding?: number;
  range: [number, number];
  tickCount?: number;
  type?: ScaleType;
  values: number[];
}): Scale => {
  const isLog = type === 'log';
  const valid = values.filter((v) => Number.isFinite(v) && (!isLog || v > 0));
  const toSpace = (v: number) => (isLog ? Math.log10(v) : v);
  const fromSpace = (v: number) => (isLog ? 10 ** v : v);

  let lo = valid.length ? Math.min(...valid.map(toSpace)) : 0;
  let hi = valid.length ? Math.max(...valid.map(toSpace)) : 1;
  if (lo === hi) {
    const delta = lo === 0 ? 1 : Math.abs(lo) * 0.1;
    lo -= delta;
    hi += delta;
  }
  const pad = (hi - lo) * padding;
  lo = typeof min === 'number' && (!isLog || min > 0) ? toSpace(min) : lo - pad;
  hi = typeof max === 'number' && (!isLog || max > 0) ? toSpace(max) : hi + pad;

  const domain: [number, number] = [fromSpace(lo), fromSpace(hi)];
  const span = hi - lo || 1;
  const map = (value: number) =>
    range[0] +
    ((toSpace(Math.max(value, isLog ? domain[0] : -Infinity)) - lo) / span) * (range[1] - range[0]);

  let ticks = isLog ? getLogTicks(domain[0], domain[1]) : getLinearTicks(...domain, tickCount);
  if (isLog && ticks.length < 2) {
    ticks = getLinearTicks(lo, hi, tickCount).map((v) => Number(fromSpace(v).toPrecision(3)));
  }

  return { domain, map, ticks };
};

/**
 * Pareto frontier: points not dominated by any other point.
 * `xDirection = 'lower'` treats smaller X as better (e.g. cost / latency).
 * Returns keys ordered by ascending X.
 */
export const getParetoFrontier = <T extends { key: string | number; x: number; y: number }>(
  points: T[],
  xDirection: 'lower' | 'higher' = 'lower',
): T[] => {
  const sign = xDirection === 'lower' ? 1 : -1;
  const sorted = [...points]
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
    .sort((a, b) => sign * (a.x - b.x) || b.y - a.y);

  const frontier: T[] = [];
  let bestY = -Infinity;
  for (const point of sorted) {
    if (point.y > bestY) {
      frontier.push(point);
      bestY = point.y;
    }
  }
  return frontier.sort((a, b) => a.x - b.x);
};

export type LabelPlacement =
  'right' | 'left' | 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface Box {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface LabelCandidate {
  height: number;
  key: string | number;
  px: number;
  py: number;
  radius: number;
  width: number;
}

export interface PlacedLabel extends Box {
  key: string | number;
  placement: LabelPlacement;
}

// Ordered by preference; `shift` nudges side labels vertically (in label heights)
const PLACEMENTS: Array<{ placement: LabelPlacement; shift?: number }> = [
  { placement: 'right' },
  { placement: 'left' },
  { placement: 'right', shift: -0.5 },
  { placement: 'right', shift: 0.5 },
  { placement: 'left', shift: -0.5 },
  { placement: 'left', shift: 0.5 },
  { placement: 'top-right' },
  { placement: 'bottom-right' },
  { placement: 'top-left' },
  { placement: 'bottom-left' },
  { placement: 'top' },
  { placement: 'bottom' },
];

const getLabelBox = (
  { px, py, radius, width, height }: LabelCandidate,
  placement: LabelPlacement,
  gap: number,
): Box => {
  const offset = radius + gap;
  const diagonal = radius * 0.7 + gap;
  switch (placement) {
    case 'right': {
      return { height, width, x: px + offset, y: py - height / 2 };
    }
    case 'left': {
      return { height, width, x: px - offset - width, y: py - height / 2 };
    }
    case 'top': {
      return { height, width, x: px - width / 2, y: py - offset - height };
    }
    case 'bottom': {
      return { height, width, x: px - width / 2, y: py + offset };
    }
    case 'top-right': {
      return { height, width, x: px + diagonal, y: py - diagonal - height };
    }
    case 'top-left': {
      return { height, width, x: px - diagonal - width, y: py - diagonal - height };
    }
    case 'bottom-right': {
      return { height, width, x: px + diagonal, y: py + diagonal };
    }
    case 'bottom-left': {
      return { height, width, x: px - diagonal - width, y: py + diagonal };
    }
  }
};

const overlapArea = (a: Box, b: Box) => {
  const w = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
};

const inflate = (box: Box, by: number): Box => ({
  height: box.height + by * 2,
  width: box.width + by * 2,
  x: box.x - by,
  y: box.y - by,
});

const outOfBoundsArea = (box: Box, bounds: Box) => {
  const inside = overlapArea(box, bounds);
  return box.width * box.height - inside;
};

/**
 * Greedy label placement: candidates are processed in the given order,
 * each picks the position with the least overlap against markers,
 * already-placed labels and the outer bounds.
 */
export const placeLabels = (
  candidates: LabelCandidate[],
  bounds: Box,
  { gap = 8, lines = [] }: { gap?: number; lines?: Box[] } = {},
): Map<string | number, PlacedLabel> => {
  const markers: Array<Box & { key: string | number }> = candidates.map((c) => ({
    height: c.radius * 2,
    key: c.key,
    width: c.radius * 2,
    x: c.px - c.radius,
    y: c.py - c.radius,
  }));

  const placed = new Map<string | number, PlacedLabel>();

  for (const candidate of candidates) {
    let best: PlacedLabel | undefined;
    let bestCost = Infinity;

    PLACEMENTS.forEach(({ placement, shift = 0 }, order) => {
      const base = getLabelBox(candidate, placement, gap);
      const box = { ...base, y: base.y + shift * candidate.height };
      let cost = order * 2;
      cost += outOfBoundsArea(box, bounds) * 20;
      for (const marker of markers) {
        if (marker.key === candidate.key) continue;
        cost += overlapArea(inflate(box, 3), marker) * 10;
      }
      for (const label of placed.values()) cost += overlapArea(inflate(box, 2), label) * 8;
      for (const line of lines) cost += overlapArea(box, line) * 1.5;

      if (cost < bestCost) {
        bestCost = cost;
        best = { ...box, key: candidate.key, placement };
      }
    });

    if (best) placed.set(candidate.key, best);
  }

  return placed;
};
