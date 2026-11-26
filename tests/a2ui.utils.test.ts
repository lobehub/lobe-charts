import { describe, expect, it } from 'vitest';

import { parseCandles, periodChange, thinLabels } from '@/CandlestickChart/utils';
import {
  createTickFormatter,
  createValueFormatter,
  curveA2uiMonotone,
  formatNumber,
  niceDomain,
  niceScale,
  rightMarginFor,
  yAxisWidthFor,
} from '@/common/a2ui';
import { gaugeArcPath } from '@/GaugeChart/utils';
import { heatColor, heatPercent, parseHeatmap } from '@/HeatmapChart/utils';
import { layoutSankey, prepareSankey } from '@/SankeyChart/utils';
import { layoutTreemap } from '@/TreemapChart/utils';

describe('a2ui number formatting', () => {
  it('formats the four formats', () => {
    expect(formatNumber(1234.5)).toBe('1,234.5');
    expect(formatNumber(48_200, 'compact')).toBe('48.2K');
    expect(formatNumber(412_000, 'currency')).toBe('$412,000');
    expect(formatNumber(12.345, 'currency')).toBe('$12.35');
    expect(formatNumber(72, 'percent')).toBe('72%');
    expect(formatNumber(84, 'number', 'ms')).toBe('84 ms');
    expect(formatNumber(72, 'percent', '%')).toBe('72%');
  });

  it('formats compact ticks per format', () => {
    expect(createTickFormatter({ format: 'currency' })(600_000)).toBe('$600K');
    expect(createTickFormatter({ currency: 'EUR', format: 'currency' })(1500)).toBe('€1.5K');
    expect(createTickFormatter({ format: 'percent' })(25)).toBe('25%');
    expect(createTickFormatter({ unit: 'ms' })(300)).toBe('300 ms');
    expect(createTickFormatter()(1000)).toBe('1K');
  });

  it('formats tooltip values at full precision', () => {
    expect(createValueFormatter({ format: 'currency' })(16_520)).toBe('$16,520');
  });
});

describe('a2ui scales', () => {
  it('nices a domain like d3', () => {
    expect(niceDomain(9800, 38_400)).toEqual([5000, 40_000]);
    expect(niceDomain(120, 960)).toEqual([0, 1000]);
  });

  it('includes zero when asked', () => {
    expect(niceScale([94_000, 538_000], { includeZero: true })).toEqual({
      domain: [0, 600_000],
      ticks: [0, 100_000, 200_000, 300_000, 400_000, 500_000, 600_000],
    });
  });

  it('reserves axis room from label widths', () => {
    expect(yAxisWidthFor(['40K', '5K'])).toBe(26);
    expect(rightMarginFor('1K', 40)).toBe(4);
  });
});

describe('monotone curve', () => {
  it('draws a smooth path through the points', () => {
    const calls: string[] = [];
    const context = {
      bezierCurveTo: () => calls.push('C'),
      closePath: () => calls.push('Z'),
      lineTo: () => calls.push('L'),
      moveTo: () => calls.push('M'),
    };
    const curve = curveA2uiMonotone(context);
    curve.lineStart();
    for (const [x, y] of [
      [0, 0],
      [1, 2],
      [2, 1],
      [3, 3],
    ])
      curve.point(x, y);
    curve.lineEnd();
    expect(calls).toEqual(['M', 'C', 'C', 'C']);
  });

  it('closes an area after its baseline', () => {
    const calls: string[] = [];
    const context = {
      bezierCurveTo: () => calls.push('C'),
      closePath: () => calls.push('Z'),
      lineTo: () => calls.push('L'),
      moveTo: () => calls.push('M'),
    };
    const curve = curveA2uiMonotone(context);
    curve.areaStart();
    curve.lineStart();
    curve.point(0, 0);
    curve.point(1, 1);
    curve.lineEnd();
    curve.lineStart();
    curve.point(1, 5);
    curve.point(0, 5);
    curve.lineEnd();
    curve.areaEnd();
    expect(calls).toEqual(['M', 'L', 'L', 'L', 'Z']);
  });
});

describe('treemap layout', () => {
  const leaves = [
    { group: 'Compute', name: 'VMs', value: 48_200 },
    { group: 'Compute', name: 'Functions', value: 12_800 },
    { group: 'Storage', name: 'Objects', value: 21_400 },
    { group: 'AI', name: 'Inference', value: 17_300 },
  ];

  it('tiles every leaf inside the box with padding', () => {
    const { cells, keys, total } = layoutTreemap(leaves, 600, 200);
    expect(total).toBe(99_700);
    expect(keys).toEqual(['Compute', 'Storage', 'AI']);
    expect(cells).toHaveLength(4);
    for (const c of cells) {
      expect(c.x0).toBeGreaterThanOrEqual(3 - 1e-9);
      expect(c.y0).toBeGreaterThanOrEqual(3 - 1e-9);
      expect(c.x1).toBeLessThanOrEqual(597 + 1e-9);
      expect(c.y1).toBeLessThanOrEqual(197 + 1e-9);
    }
    // The largest leaf gets the largest area.
    const area = (c: (typeof cells)[number]) => (c.x1 - c.x0) * (c.y1 - c.y0);
    const vms = cells.find((c) => c.name === 'VMs')!;
    expect(cells.every((c) => area(c) <= area(vms))).toBe(true);
  });

  it('merges duplicate leaves and drops non-positive ones', () => {
    const { cells } = layoutTreemap(
      [
        { group: '', name: 'A', value: 1 },
        { group: '', name: 'A', value: 2 },
        { group: '', name: 'B', value: 0 },
      ],
      100,
      100,
    );
    expect(cells.map((c) => [c.name, c.value])).toEqual([['A', 3]]);
  });
});

describe('sankey layout', () => {
  const links = [
    { source: 'Organic', target: 'Visited pricing', value: 21_000 },
    { source: 'Paid ads', target: 'Visited pricing', value: 12_500 },
    { source: 'Visited pricing', target: 'Started trial', value: 14_200 },
    { source: 'Visited pricing', target: 'Bounced', value: 25_800 },
    { source: 'Started trial', target: 'Paid', value: 5100 },
    { source: 'Started trial', target: 'Visited pricing', value: 10 },
    { source: 'Paid', target: 'Paid', value: 3 },
  ];

  it('drops self links and links that close a cycle', () => {
    const { ids, links: kept } = prepareSankey(links);
    expect(kept).toHaveLength(5);
    expect(ids).toEqual([
      'Organic',
      'Visited pricing',
      'Paid ads',
      'Started trial',
      'Bounced',
      'Paid',
    ]);
  });

  it('justifies sinks into the last column', () => {
    const { ids, links: kept } = prepareSankey(links);
    const { nodes } = layoutSankey(ids, kept, {
      nodePadding: 14,
      nodeWidth: 10,
      x0: 0,
      x1: 600,
      y0: 0,
      y1: 280,
    });
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    expect(byId.Organic.layer).toBe(0);
    expect(byId['Visited pricing'].layer).toBe(1);
    expect(byId.Bounced.layer).toBe(3);
    expect(byId.Paid.layer).toBe(3);
    expect(byId['Visited pricing'].value).toBe(40_000);
    for (const n of nodes) {
      expect(n.y0).toBeGreaterThanOrEqual(-1e-6);
      expect(n.y1).toBeLessThanOrEqual(280 + 1e-6);
    }
  });
});

describe('heatmap utils', () => {
  it('parses cells and categories in order', () => {
    const { cells, xs, ys, min, max } = parseHeatmap(
      [
        { v: 3, x: 'b', y: 'r1' },
        { v: 1, x: 'a', y: 'r2' },
        { v: 'x', x: 'c', y: 'r1' },
      ],
      'x',
      'y',
      'v',
    );
    expect(cells).toHaveLength(2);
    expect(xs).toEqual(['b', 'a']);
    expect(ys).toEqual(['r1', 'r2']);
    expect([min, max]).toEqual([1, 3]);
  });

  it('eases the ramp from 4% to 100%', () => {
    expect(heatPercent(0)).toBe(4);
    expect(heatPercent(1)).toBe(100);
    expect(heatColor(1, 'red')).toBe('color-mix(in oklch, red 100%, var(--a2-heat-low))');
  });
});

describe('candlestick utils', () => {
  it('widens high / low and reads the direction', () => {
    const [c] = parseCandles([{ close: 9, date: 'd1', high: 8, low: 7, open: 7.5 }], 'date');
    expect(c).toMatchObject({ dir: 'up', high: 9, low: 7 });
    expect(periodChange([c])).toBeCloseTo(20);
  });

  it('thins overlapping labels and keeps the last one', () => {
    expect(thinLabels([0, 10, 20, 30, 40], [16, 16, 16, 16, 16], 4)).toEqual([0, 2, 4]);
    expect(thinLabels([0, 10, 20, 30], [16, 16, 16, 16], 4)).toEqual([0, 3]);
  });
});

describe('gauge arc', () => {
  it('draws a closed rounded sector and nothing for an empty span', () => {
    expect(gaugeArcPath(100, 100, 70, 90, 0, 0.5)).toMatch(/^M.*Z$/);
    expect(gaugeArcPath(100, 100, 70, 90, 0.5, 0.5)).toBe('');
  });
});
