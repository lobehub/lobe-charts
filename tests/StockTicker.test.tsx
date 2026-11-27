import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import StockTicker from '@/StockTicker';

const series = [176.2, 177.1, 176.4, 178.3, 182.47];
const stats = [
  { label: 'Open', value: '179.40' },
  { label: 'P/E', value: '31.4' },
];

describe('StockTicker', () => {
  beforeEach(() => {
    // The sparkline is a recharts ResponsiveContainer, which needs ResizeObserver.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        disconnect() {}
        observe() {}
        unobserve() {}
      },
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows symbol, name, price, change, stats and the sample badge', () => {
    render(
      <StockTicker
        sample
        change={3.21}
        changePct={1.79}
        name="Kestrel Robotics Inc."
        price={182.47}
        series={series}
        stats={stats}
        symbol="HLVR"
        variant="a2ui"
      />,
    );
    expect(screen.getAllByText('HLVR').length).toBe(2);
    expect(screen.getByText('Kestrel Robotics Inc.')).toBeTruthy();
    expect(screen.getByText('$182.47')).toBeTruthy();
    expect(screen.getByText(/\+3\.21/).textContent).toBe('+3.21 (+1.79%)');
    expect(screen.getByText('Open')).toBeTruthy();
    expect(screen.getByText('31.4')).toBeTruthy();
    expect(screen.getByText('Sample data')).toBeTruthy();
  });

  it('signs a falling quote and formats other currencies', () => {
    render(
      <StockTicker
        change={-4.86}
        changePct={-2.31}
        currency="EUR"
        locale="de-DE"
        price={205.6}
        symbol="NWE"
      />,
    );
    expect(screen.getByText(/-4\.86/).textContent).toBe('-4.86 (-2.31%)');
    expect(screen.getByText(/205,60/)).toBeTruthy();
  });

  it('marks the variant and draws the sparkline only with two or more prices', () => {
    const { container, rerender } = render(<StockTicker price={10} series={[10]} symbol="X" />);
    expect(container.firstElementChild?.getAttribute('data-variant')).toBe('default');
    expect(container.querySelector('line')).toBeNull();
    rerender(<StockTicker price={10} series={[9, 10]} symbol="X" variant="a2ui" />);
    expect(container.firstElementChild?.getAttribute('data-variant')).toBe('a2ui');
    expect(container.querySelector('line')).not.toBeNull();
  });

  it('shows -- without a valid price and no sample badge by default', () => {
    render(<StockTicker price={Number.NaN} symbol="X" />);
    expect(screen.getByText('--')).toBeTruthy();
    expect(screen.queryByText('Sample data')).toBeNull();
  });
});
