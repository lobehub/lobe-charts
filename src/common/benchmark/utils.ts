import { getTextWidth } from '@/utils/getMaxLabelLength';

import type {
  BenchmarkFieldKeys,
  BenchmarkRecord,
  BenchmarkRenderIcon,
  NormalizedBenchmarkItem,
} from './types';

export const DEFAULT_BENCHMARK_KEYS = {
  colorKey: 'color',
  errorKey: 'error',
  iconKey: 'icon',
  index: 'name',
  lineKey: 'line',
  providerKey: 'provider',
  valueKey: 'score',
} as const;

export const resolveBenchmarkKeys = (keys: BenchmarkFieldKeys = {}) => ({
  colorKey: keys.colorKey ?? DEFAULT_BENCHMARK_KEYS.colorKey,
  errorKey: keys.errorKey ?? DEFAULT_BENCHMARK_KEYS.errorKey,
  iconKey: keys.iconKey ?? DEFAULT_BENCHMARK_KEYS.iconKey,
  index: keys.index ?? DEFAULT_BENCHMARK_KEYS.index,
  lineKey: keys.lineKey ?? DEFAULT_BENCHMARK_KEYS.lineKey,
  providerKey: keys.providerKey ?? DEFAULT_BENCHMARK_KEYS.providerKey,
  valueKey: keys.valueKey ?? DEFAULT_BENCHMARK_KEYS.valueKey,
});

export const getBenchmarkIcon = (
  record: BenchmarkRecord,
  iconKey: string,
  renderIcon?: BenchmarkRenderIcon,
  index = 0,
) => {
  if (renderIcon) return renderIcon(record, index);
  return record[iconKey] as BenchmarkRecord['icon'];
};

export const normalizeBenchmarkData = ({
  colorKey,
  data,
  errorKey,
  iconKey,
  index,
  lineKey,
  providerKey,
  renderIcon,
  sortOrder = 'descending',
  valueKey,
}: BenchmarkFieldKeys & {
  data: BenchmarkRecord[];
  renderIcon?: BenchmarkRenderIcon;
  sortOrder?: 'ascending' | 'descending' | 'none';
}): NormalizedBenchmarkItem[] => {
  const keys = resolveBenchmarkKeys({
    colorKey,
    errorKey,
    iconKey,
    index,
    lineKey,
    providerKey,
    valueKey,
  });

  const sorted =
    sortOrder === 'none'
      ? [...data]
      : [...data].sort((a, b) => {
          const aUnranked = Boolean(a.unranked);
          const bUnranked = Boolean(b.unranked);
          if (aUnranked !== bUnranked) return aUnranked ? 1 : -1;

          const aValue = Number(a[keys.valueKey] ?? 0);
          const bValue = Number(b[keys.valueKey] ?? 0);
          return sortOrder === 'ascending' ? aValue - bValue : bValue - aValue;
        });

  return sorted.map((record, idx) => {
    const name = record[keys.index] ?? record.name ?? '';
    const value = Number(record[keys.valueKey] ?? 0);
    const rank = typeof record.rank === 'number' ? record.rank : idx + 1;
    const rawError = record[keys.errorKey];
    const error =
      rawError === undefined || rawError === null || rawError === '' ? undefined : Number(rawError);
    const rawLine = record[keys.lineKey] ?? record.line;
    const lineValue =
      rawLine === undefined || rawLine === null || rawLine === '' ? undefined : Number(rawLine);

    return {
      color: record[keys.colorKey] ?? record.color,
      error: Number.isFinite(error) ? error : undefined,
      highlighted: Boolean(record.highlighted),
      href: record.href,
      icon: getBenchmarkIcon(record, keys.iconKey, renderIcon, idx),
      key: record.key ?? (name === '' || name === undefined || name === null ? idx : String(name)),
      lineValue: Number.isFinite(lineValue) ? lineValue : undefined,
      name,
      original: record,
      provider: record[keys.providerKey] ?? record.provider,
      rank,
      target: record.target,
      unranked: Boolean(record.unranked),
      value,
    };
  });
};

export const getBenchmarkMaxValue = (
  items: NormalizedBenchmarkItem[],
  maxValue?: number,
): number => {
  if (typeof maxValue === 'number') return maxValue;
  return Math.max(...items.flatMap((item) => [item.value, item.lineValue ?? 0]), 0);
};

export const getBenchmarkBarPercent = (value: number, maxValue: number, minPercent = 2) => {
  if (maxValue <= 0 || value <= 0) return 0;
  return Math.max((value / maxValue) * 100, minPercent);
};

export const defaultBenchmarkValueFormatter = (value: number) => {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
};

export const defaultBenchmarkAccuracyFormatter = (value: number) => `${value.toFixed(1)}%`;

export const defaultBenchmarkErrorFormatter = (value: number) => value.toFixed(1);

export const formatBenchmarkAccuracyDisplay = ({
  accuracyFormatter,
  error,
  errorFormatter = defaultBenchmarkErrorFormatter,
  showError = true,
  value,
  valueFormatter = defaultBenchmarkValueFormatter,
}: {
  accuracyFormatter?: (value: number) => string;
  error?: number;
  errorFormatter?: (value: number) => string;
  showError?: boolean;
  value: number;
  valueFormatter?: (value: number) => string;
}) => {
  const formatValue = accuracyFormatter ?? valueFormatter;
  const main = formatValue(value);
  if (!showError || error === undefined || error === null || Number.isNaN(error)) {
    return { errorText: undefined, main, text: main };
  }
  const errorText = errorFormatter(error);
  return { errorText, main, text: `${main} ± ${errorText}` };
};

/**
 * Split a label into lines. Supports `\n` / `\r\n`.
 */
export const splitBenchmarkLabel = (label: unknown): string[] => {
  const text = String(label ?? '');
  if (!text) return [''];
  return text.split(/\r?\n/);
};

export const getBenchmarkLabelMetrics = (label: unknown) => {
  const lines = splitBenchmarkLabel(label);
  const longestWidth = lines.reduce((max, line) => Math.max(max, getTextWidth(line)), 0);
  return { lineCount: Math.max(lines.length, 1), lines, longestWidth };
};
