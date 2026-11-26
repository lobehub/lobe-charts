// Linear "nice" ticks and the label-width estimate the a2ui axes use.
// Tick math adapted from d3-array `ticks` / d3-scale `nice` (ISC, Mike Bostock).

const e10 = Math.sqrt(50);
const e5 = Math.sqrt(10);
const e2 = Math.sqrt(2);

const tickSpec = (start: number, stop: number, count: number): [number, number, number] => {
  const step = (stop - start) / Math.max(0, count);
  const power = Math.floor(Math.log10(step));
  const error = step / 10 ** power;
  const factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  let i1: number, i2: number, inc: number;
  if (power < 0) {
    inc = 10 ** -power / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start) ++i1;
    if (i2 / inc > stop) --i2;
    inc = -inc;
  } else {
    inc = 10 ** power * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start) ++i1;
    if (i2 * inc > stop) --i2;
  }
  if (i2 < i1 && count >= 0.5 && count < 2) return tickSpec(start, stop, count * 2);
  return [i1, i2, inc];
};

const tickIncrement = (start: number, stop: number, count: number) =>
  tickSpec(start, stop, count)[2];

export const ticks = (start: number, stop: number, count: number): number[] => {
  if (!(count > 0) || start === stop) return [start];
  const reverse = stop < start;
  const [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
  if (!(i2 >= i1)) return [];
  const n = i2 - i1 + 1;
  const out = Array.from({ length: n }, () => 0);
  if (reverse) {
    if (inc < 0) for (let i = 0; i < n; ++i) out[i] = (i2 - i) / -inc;
    else for (let i = 0; i < n; ++i) out[i] = (i2 - i) * inc;
  } else if (inc < 0) for (let i = 0; i < n; ++i) out[i] = (i1 + i) / -inc;
  else for (let i = 0; i < n; ++i) out[i] = (i1 + i) * inc;
  return out;
};

/** d3-scale `linear().domain([min, max]).nice(count)`. */
export const niceDomain = (min: number, max: number, count = 5): [number, number] => {
  let start = min;
  let stop = max;
  if (stop < start) [start, stop] = [stop, start];
  if (start === stop) {
    if (start === 0) return [0, 1];
    const pad = Math.abs(start) * 0.1;
    start -= pad;
    stop += pad;
  }
  let prestep: number | undefined;
  for (let i = 0; i < 10; i++) {
    const step = tickIncrement(start, stop, count);
    if (step === prestep) break;
    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
    } else break;
    prestep = step;
  }
  return [start, stop];
};

/** Nice domain and its ticks for a set of values. */
export const niceScale = (values: number[], { includeZero = false, count = 5 } = {}) => {
  const finite = values.filter((v) => Number.isFinite(v));
  let min = finite.length > 0 ? Math.min(...finite) : 0;
  let max = finite.length > 0 ? Math.max(...finite) : 1;
  if (includeZero) {
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  const domain = niceDomain(min, max, count);
  return { domain, ticks: ticks(domain[0], domain[1], count) };
};

/**
 * Width reserved for an 11px tick label. The official axes reserve a fixed advance per character,
 * so the plot starts at the same place regardless of the host font.
 */
export const estimateLabelWidth = (text: string, fontSize = 11) =>
  Math.ceil(String(text).length * fontSize * (8 / 11));

let measureContext: CanvasRenderingContext2D | null | undefined;

/** Text width with the given CSS font, via canvas when available, otherwise an estimate. */
export const measureTextWidth = (text: string, font: string, fontSize: number) => {
  if (measureContext === undefined) {
    try {
      measureContext =
        typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
    } catch {
      measureContext = null;
    }
  }
  if (measureContext) {
    measureContext.font = font;
    const w = measureContext.measureText(text).width;
    if (w > 0) return w;
  }
  return text.length * fontSize * 0.6;
};

/** Font family an element renders with, for text measurement. */
export const fontFamilyOf = (el?: Element | null) =>
  el && typeof getComputedStyle === 'function' ? getComputedStyle(el).fontFamily : 'sans-serif';
