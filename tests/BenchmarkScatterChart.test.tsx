import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import BenchmarkScatterChart from '@/BenchmarkScatterChart';
import {
  createScale,
  getLogTicks,
  getParetoFrontier,
  placeLabels,
} from '@/BenchmarkScatterChart/utils';

vi.mock('@lobehub/ui', () => ({
  A: ({ children, ...rest }: any) => <a {...rest}>{children}</a>,
  Skeleton: { Block: () => <div data-testid="skeleton" /> },
}));

const data = [
  { cost: 3.47, name: 'Codex', score: 66.7, time: 403 },
  {
    cost: 18.34,
    icon: <span data-testid="icon-claude">C</span>,
    name: 'Claude Code',
    score: 63.3,
    time: 578,
  },
  { cost: 2.43, name: 'Pi', score: 60, time: 453 },
  { cost: 1.05, name: 'Exo Harness', score: 53.3, time: 377 },
  { cost: 3.24, name: 'OpenCode', score: 50, time: 387 },
];

describe('getParetoFrontier', () => {
  it('keeps only non-dominated points when lower x is better', () => {
    const points = data.map((d) => ({ key: d.name, x: d.cost, y: d.score }));
    expect(getParetoFrontier(points).map((p) => p.key)).toEqual(['Exo Harness', 'Pi', 'Codex']);
  });

  it('supports higher-is-better x', () => {
    const points = [
      { key: 'a', x: 1, y: 90 },
      { key: 'b', x: 5, y: 80 },
      { key: 'c', x: 3, y: 70 },
    ];
    expect(getParetoFrontier(points, 'higher').map((p) => p.key)).toEqual(['a', 'b']);
  });
});

describe('scales', () => {
  it('produces 1-2-5 log ticks', () => {
    expect(getLogTicks(0.9, 25)).toEqual([1, 2, 5, 10, 20]);
  });

  it('maps domain to range', () => {
    const scale = createScale({ max: 100, min: 0, range: [0, 200], values: [10, 90] });
    expect(scale.map(50)).toBe(100);
  });
});

describe('placeLabels', () => {
  it('flips labels away from the right edge', () => {
    const placed = placeLabels([{ height: 20, key: 'a', px: 190, py: 50, radius: 5, width: 60 }], {
      height: 100,
      width: 200,
      x: 0,
      y: 0,
    });
    expect(placed.get('a')?.placement).toBe('left');
  });
});

describe('BenchmarkScatterChart', () => {
  it('renders labels, legend, icons and the frontier', () => {
    render(
      <BenchmarkScatterChart data={data} showLegend={false} width={800} xKey="cost" xScale="log" />,
    );

    expect(screen.getByText('Codex')).toBeTruthy();
    expect(screen.getByTestId('icon-claude')).toBeTruthy();
    expect(screen.getByTestId('benchmark-scatter-frontier')).toBeTruthy();
  });

  it('switches metrics', () => {
    const onMetricChange = vi.fn();
    render(
      <BenchmarkScatterChart
        data={data}
        metrics={[
          { formatter: (v) => `$${v}`, key: 'cost', label: 'Cost', scale: 'log' },
          { formatter: (v) => `${v}s`, key: 'time', label: 'Speed' },
        ]}
        onMetricChange={onMetricChange}
        showLegend={false}
        width={800}
      />,
    );

    expect(screen.getByText(/\$3\.47/)).toBeTruthy();
    fireEvent.click(screen.getByText('Speed'));
    expect(onMetricChange).toHaveBeenCalledWith('time');
    expect(screen.getByText(/403s/)).toBeTruthy();
  });

  it('emits point events on click', () => {
    const onValueChange = vi.fn();
    render(
      <BenchmarkScatterChart
        data={data}
        onValueChange={onValueChange}
        showTooltip={false}
        width={800}
        xKey="cost"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /^Pi:/ }));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'point', name: 'Pi', value: 60 }),
    );
  });

  it('highlights the dominated area on hover', () => {
    render(<BenchmarkScatterChart data={data} showTooltip={false} width={800} xKey="cost" />);

    expect(screen.queryByTestId('benchmark-scatter-dominated-area')).toBeNull();
    fireEvent.mouseEnter(screen.getByRole('button', { name: /^Pi:/ }));
    expect(screen.getByTestId('benchmark-scatter-dominated-area')).toBeTruthy();

    // OpenCode ($3.24, 50%) is dominated by Pi ($2.43, 60%); Codex is not
    const openCode = screen.getByRole('button', { name: /^OpenCode:/ }) as HTMLElement;
    const codex = screen.getByRole('button', { name: /^Codex:/ }) as HTMLElement;
    expect(openCode.style.filter).toBe('grayscale(1)');
    expect(codex.style.filter).toBe('');
  });

  it('shows skeleton while loading', () => {
    render(<BenchmarkScatterChart data={[]} loading />);
    expect(screen.getByTestId('skeleton')).toBeTruthy();
  });
});
