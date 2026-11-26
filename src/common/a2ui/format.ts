// Number formatting for the a2ui look.
// Adapted from CopilotKit a2ui-playground (MIT): src/a2ui/catalog/renderers/format.ts + chart-kit.tsx

export type ChartNumberFormat = 'number' | 'compact' | 'currency' | 'percent';

export interface A2uiFormatOptions {
  currency?: string;
  format?: ChartNumberFormat;
  unit?: string;
}

const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Full-precision value for tooltips, centers and labels. `percent` expects 0-100. */
export const formatNumber = (
  value: unknown,
  format: ChartNumberFormat = 'number',
  unit?: string,
  currency = 'USD',
): string => {
  if (!isFiniteNumber(value)) return value === null || value === undefined ? '' : String(value);
  let out: string;
  switch (format) {
    case 'currency': {
      out = new Intl.NumberFormat('en-US', {
        currency,
        maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
        style: 'currency',
      }).format(value);
      break;
    }
    case 'percent': {
      out = `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)}%`;
      break;
    }
    case 'compact': {
      out = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 1,
        notation: 'compact',
      }).format(value);
      break;
    }
    default: {
      out = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
    }
  }
  if (format === 'percent' && unit?.trim() === '%') unit = undefined;
  return unit ? `${out}${unit.startsWith('%') || unit.startsWith('°') ? '' : ' '}${unit}` : out;
};

/** Currency symbol for an ISO code, e.g. `USD` -> `$`. */
export const currencySymbol = (currency = 'USD'): string => {
  try {
    return (
      new Intl.NumberFormat('en-US', { currency, style: 'currency' })
        .formatToParts(0)
        .find((p) => p.type === 'currency')?.value ?? currency
    );
  } catch {
    return currency;
  }
};

/** Value formatter for tooltips and labels. */
export const createValueFormatter =
  ({ format, unit, currency }: A2uiFormatOptions = {}) =>
  (v: unknown) =>
    formatNumber(v, format ?? 'number', unit, currency);

/** Compact axis ticks: $1.2K, 34%, 1.4M ms. */
export const createTickFormatter =
  ({ format, unit, currency }: A2uiFormatOptions = {}) =>
  (v: number) => {
    if (format === 'currency')
      return `${v < 0 ? '-' : ''}${currencySymbol(currency)}${formatNumber(Math.abs(v), 'compact')}`;
    if (format === 'percent') return formatNumber(v, 'percent');
    return formatNumber(v, Math.abs(v) >= 1000 ? 'compact' : 'number', unit);
  };

/** Format used for big summary numbers (donut centre, legend values). */
export const summaryFormat = (format?: ChartNumberFormat): ChartNumberFormat =>
  format === 'currency' ? 'currency' : format === 'percent' ? 'percent' : 'compact';

export const shortLabel = (v: unknown, max = 14) => {
  const s = String(v ?? '');
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
};
