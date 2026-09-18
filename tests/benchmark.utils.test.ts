import { describe, expect, it } from 'vitest';

import {
  defaultBenchmarkAccuracyFormatter,
  defaultBenchmarkErrorFormatter,
  defaultBenchmarkValueFormatter,
  formatBenchmarkAccuracyDisplay,
  getBenchmarkBarPercent,
  getBenchmarkIcon,
  getBenchmarkLabelMetrics,
  getBenchmarkMaxValue,
  normalizeBenchmarkData,
  resolveBenchmarkKeys,
  splitBenchmarkLabel,
} from '@/common/benchmark';

describe('benchmark utils', () => {
  it('resolves default field keys', () => {
    expect(resolveBenchmarkKeys()).toEqual({
      colorKey: 'color',
      errorKey: 'error',
      iconKey: 'icon',
      index: 'name',
      lineKey: 'line',
      providerKey: 'provider',
      valueKey: 'score',
    });
  });

  it('normalizes, sorts and assigns ranks', () => {
    const items = normalizeBenchmarkData({
      data: [
        { name: 'B', score: 10 },
        { name: 'A', score: 30 },
        { name: 'C', score: 20 },
      ],
      sortOrder: 'descending',
    });

    expect(items.map((item) => item.name)).toEqual(['A', 'C', 'B']);
    expect(items.map((item) => item.rank)).toEqual([1, 2, 3]);
    expect(items[0].value).toBe(30);
  });

  it('supports custom keys and renderIcon override', () => {
    const icon = 'rendered-icon';
    const items = normalizeBenchmarkData({
      colorKey: 'tint',
      data: [{ model: 'GPT', org: 'OpenAI', tint: '#000', value: 12 }],
      index: 'model',
      providerKey: 'org',
      renderIcon: () => icon,
      sortOrder: 'none',
      valueKey: 'value',
    });

    expect(items[0]).toMatchObject({
      color: '#000',
      name: 'GPT',
      provider: 'OpenAI',
      value: 12,
    });
    expect(items[0].icon).toBe(icon);
  });

  it('prefers renderIcon over iconKey', () => {
    const rendered = 'rendered';
    expect(getBenchmarkIcon({ icon: 'raw' }, 'icon', () => rendered)).toBe(rendered);
  });

  it('computes max value and bar percent', () => {
    const items = normalizeBenchmarkData({
      data: [
        { name: 'A', score: 50 },
        { name: 'B', score: 100 },
      ],
    });

    expect(getBenchmarkMaxValue(items)).toBe(100);
    expect(getBenchmarkMaxValue(items, 80)).toBe(80);
    expect(getBenchmarkBarPercent(50, 100)).toBe(50);
    expect(getBenchmarkBarPercent(0, 100)).toBe(0);
    expect(getBenchmarkBarPercent(1, 100)).toBe(2);
  });

  it('formats benchmark values', () => {
    expect(defaultBenchmarkValueFormatter(57)).toBe('57');
    expect(defaultBenchmarkValueFormatter(82.6)).toBe('82.6');
  });

  it('splits labels by newline', () => {
    expect(splitBenchmarkLabel('Claude Fable 5.1\n(max)')).toEqual(['Claude Fable 5.1', '(max)']);
    expect(getBenchmarkLabelMetrics('A\nBB\nC').lineCount).toBe(3);
  });

  it('formats accuracy with optional error', () => {
    expect(defaultBenchmarkAccuracyFormatter(52)).toBe('52.0%');
    expect(defaultBenchmarkErrorFormatter(1.25)).toBe('1.3');
    expect(
      formatBenchmarkAccuracyDisplay({
        accuracyFormatter: defaultBenchmarkAccuracyFormatter,
        error: 1.1,
        value: 52,
      }).text,
    ).toBe('52.0% ± 1.1');
    expect(
      formatBenchmarkAccuracyDisplay({
        error: 1.1,
        showError: false,
        value: 52,
        valueFormatter: defaultBenchmarkValueFormatter,
      }).text,
    ).toBe('52');
  });

  it('normalizes error field', () => {
    const items = normalizeBenchmarkData({
      data: [{ error: 1.2, name: 'A', score: 50 }],
      sortOrder: 'none',
    });
    expect(items[0].error).toBe(1.2);
  });
});
