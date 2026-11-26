import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AreaChart from '@/AreaChart';
import BarChart from '@/BarChart';
import CandlestickChart from '@/CandlestickChart';
import ChartFrame from '@/ChartFrame';
import DonutChart from '@/DonutChart';
import GaugeChart from '@/GaugeChart';
import HeatmapChart from '@/HeatmapChart';
import LineChart from '@/LineChart';
import RadarChart from '@/RadarChart';
import SankeyChart from '@/SankeyChart';
import ScatterChart from '@/ScatterChart';
import { SparkAreaChart, SparkBarChart, SparkLineChart } from '@/SparkChart';
import TreemapChart from '@/TreemapChart';

vi.mock('@lobehub/ui', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  Skeleton: () => <div data-testid="skeleton" />,
}));

const months = ['Jan', 'Feb', 'Mar', 'Apr'];
const trend = months.map((month, i) => ({ Mobile: 9800 + i * 1500, Web: 18_200 + i * 900, month }));

describe('a2ui variant on existing charts', () => {
  it('LineChart draws its own frame with title, subtitle and header legend', () => {
    const { container } = render(
      <LineChart
        categories={['Web', 'Mobile']}
        data={trend}
        format="compact"
        index="month"
        subtitle="Last 4 months"
        title="Weekly active users"
        variant="a2ui"
      />,
    );
    expect(container.querySelector('figure')).not.toBeNull();
    expect(screen.getByText('Weekly active users')).toBeTruthy();
    expect(screen.getByText('Last 4 months')).toBeTruthy();
    expect(screen.getByText('Web')).toBeTruthy();
    expect(screen.getByText('Mobile')).toBeTruthy();
    expect(container.querySelectorAll('.recharts-line').length).toBe(2);
  });

  it('LineChart default variant keeps the old render (no frame)', () => {
    // recharts' ResponsiveContainer, used by the default look, needs ResizeObserver.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        disconnect() {}
        observe() {}
        unobserve() {}
      },
    );
    const { container } = render(
      <LineChart categories={['Web']} data={trend} index="month" title="tip" />,
    );
    expect(container.querySelector('figure')).toBeNull();
    expect(container.firstElementChild?.getAttribute('title')).toBe('tip');
    vi.unstubAllGlobals();
  });

  it('AreaChart stacks in the a2ui look', () => {
    const { container } = render(
      <AreaChart
        stack
        categories={['Web', 'Mobile']}
        data={trend}
        format="currency"
        index="month"
        title="Spend"
        variant="a2ui"
      />,
    );
    expect(screen.getByText('Spend')).toBeTruthy();
    expect(container.querySelectorAll('.recharts-area').length).toBe(2);
    expect(screen.getByText('$30K')).toBeTruthy();
  });

  it('BarChart groups series with currency ticks', () => {
    const data = [
      { '2025': 412_000, '2026': 538_000, 'region': 'NA' },
      { '2025': 298_000, '2026': 371_000, 'region': 'EMEA' },
    ];
    const { container } = render(
      <BarChart
        categories={['2025', '2026']}
        data={data}
        format="currency"
        index="region"
        title="Revenue by region"
        variant="a2ui"
      />,
    );
    expect(screen.getByText('Revenue by region')).toBeTruthy();
    expect(screen.getByText('$600K')).toBeTruthy();
    expect(container.querySelectorAll('.recharts-bar-rectangle').length).toBe(4);
  });

  it('BarChart lays horizontal bars out in the a2ui look', () => {
    const { container } = render(
      <BarChart
        categories={['score']}
        format="percent"
        index="model"
        layout="vertical"
        variant="a2ui"
        data={[
          { model: 'A', score: 92 },
          { model: 'B', score: 81 },
        ]}
      />,
    );
    expect(container.querySelectorAll('.recharts-bar-rectangle').length).toBe(2);
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('DonutChart shows the total and the value / share list', () => {
    render(
      <DonutChart
        centerLabel="sessions"
        format="compact"
        title="Traffic sources"
        variant="a2ui"
        data={[
          { name: 'Organic search', value: 48_200 },
          { name: 'Direct', value: 27_100 },
        ]}
      />,
    );
    expect(screen.getByText('75.3K')).toBeTruthy();
    expect(screen.getByText('sessions')).toBeTruthy();
    expect(screen.getByText('Organic search')).toBeTruthy();
    expect(screen.getByText('64%')).toBeTruthy();
  });

  it('ScatterChart sizes bubbles and appends the unit', () => {
    const { container } = render(
      <ScatterChart
        category="region"
        size="replicas"
        unit="ms"
        variant="a2ui"
        x="rps"
        xAxisLabel="Requests / s"
        y="latency"
        data={[
          { latency: 84, region: 'us-east', replicas: 2, rps: 120 },
          { latency: 241, region: 'eu-west', replicas: 12, rps: 880 },
        ]}
      />,
    );
    expect(screen.getByText('Requests / s')).toBeTruthy();
    expect(screen.getByText('300 ms')).toBeTruthy();
    expect(container.querySelectorAll('.recharts-scatter circle').length).toBe(2);
  });

  it('RadarChart labels every axis', () => {
    render(
      <RadarChart
        categories={['A', 'B']}
        data={['Reasoning', 'Coding', 'Math'].map((axis, i) => ({ A: 90 - i, B: 80 + i, axis }))}
        index="axis"
        maxValue={100}
        title="Eval"
        variant="a2ui"
      />,
    );
    for (const label of ['Reasoning', 'Coding', 'Math'])
      expect(screen.getByText(label)).toBeTruthy();
  });

  it('spark charts render the stat card', () => {
    const data = [128, 131, 129, 138].map((mrr, i) => ({ i, mrr }));
    for (const Spark of [SparkAreaChart, SparkLineChart, SparkBarChart]) {
      const { unmount } = render(
        <Spark
          categories={['mrr']}
          data={data}
          delta="+12.4%"
          index="i"
          label="MRR"
          variant="a2ui"
        />,
      );
      expect(screen.getByText('MRR')).toBeTruthy();
      expect(screen.getByText('+12.4%')).toBeTruthy();
      expect(screen.getByText('138')).toBeTruthy();
      unmount();
    }
  });
});

describe('new a2ui charts', () => {
  it('GaugeChart shows the value, caption and range', () => {
    const { container } = render(
      <GaugeChart format="percent" label="of 512 GPUs busy" title="GPU" value={72} />,
    );
    expect(screen.getByText('72%')).toBeTruthy();
    expect(screen.getByText('of 512 GPUs busy')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('100')).toBeTruthy();
    expect(container.querySelectorAll('svg path').length).toBe(2);
  });

  it('HeatmapChart draws a cell per row and the legend range', () => {
    const data = ['Mon', 'Tue'].flatMap((day, di) =>
      ['00', '03'].map((hour, hi) => ({ day, hour, n: 100 * (di + 1) + hi })),
    );
    const { container } = render(
      <HeatmapChart data={data} title="Requests" value="n" x="hour" y="day" />,
    );
    expect(container.querySelectorAll('svg rect').length).toBe(4);
    expect(screen.getAllByText('100').length).toBeGreaterThan(0);
    expect(screen.getAllByText('201').length).toBeGreaterThan(0);
    expect(screen.getByText('Mon')).toBeTruthy();
  });

  it('HeatmapChart shows the empty state without data', () => {
    render(<HeatmapChart data={[]} noDataText="Nothing yet" />);
    expect(screen.getByText('Nothing yet')).toBeTruthy();
  });

  it('CandlestickChart draws a candle per row and the period summary', () => {
    const { container } = render(
      <CandlestickChart
        format="currency"
        title="HLVR"
        data={[
          { close: 101, date: 'Sep 1', high: 102, low: 99, open: 100 },
          { close: 99, date: 'Sep 2', high: 101.5, low: 98, open: 101 },
        ]}
      />,
    );
    expect(container.querySelectorAll('svg rect').length).toBe(2);
    expect(screen.getByText('$99.00')).toBeTruthy();
    expect(screen.getByText(/-1.00% over period/)).toBeTruthy();
  });

  it('TreemapChart tiles every item and lists groups', () => {
    const { container } = render(
      <TreemapChart
        format="currency"
        title="Spend"
        data={[
          { group: 'Compute', name: 'VMs', value: 48_200 },
          { group: 'Compute', name: 'Functions', value: 12_800 },
          { group: 'Storage', name: 'Objects', value: 21_400 },
        ]}
      />,
    );
    expect(container.querySelectorAll('svg rect').length).toBe(3);
    expect(screen.getByText('Compute')).toBeTruthy();
    expect(screen.getByText('Storage')).toBeTruthy();
  });

  it('SankeyChart draws nodes, ribbons and value labels', () => {
    const { container } = render(
      <SankeyChart
        format="compact"
        data={[
          { source: 'Organic', target: 'Pricing', value: 21_000 },
          { source: 'Ads', target: 'Pricing', value: 12_500 },
          { source: 'Pricing', target: 'Trial', value: 14_200 },
        ]}
      />,
    );
    expect(container.querySelectorAll('svg rect').length).toBe(4);
    expect(container.querySelectorAll('svg path').length).toBe(3);
    expect(screen.getByText(/Pricing\s+33.5K/)).toBeTruthy();
  });

  it('new charts default to the plain look and take variant="a2ui" for the card', () => {
    const data = [
      { group: 'Compute', name: 'VMs', value: 48_200 },
      { group: 'Storage', name: 'Objects', value: 21_400 },
    ];
    const plain = render(<TreemapChart data={data} title="Spend" />);
    expect(plain.container.querySelector('figure')).toBeNull();
    expect(screen.queryByText('Spend')).toBeNull();
    expect(screen.getByText('Compute')).toBeTruthy();
    plain.unmount();

    const card = render(<TreemapChart data={data} title="Spend" variant="a2ui" />);
    expect(card.container.querySelector('figure')).not.toBeNull();
    expect(screen.getByText('Spend')).toBeTruthy();
    card.unmount();
  });

  it('every new chart renders in both variants', () => {
    const cases = [
      (variant: 'default' | 'a2ui') => <GaugeChart title="G" value={40} variant={variant} />,
      (variant: 'default' | 'a2ui') => (
        <HeatmapChart data={[{ value: 1, x: 'a', y: 'b' }]} title="H" variant={variant} />
      ),
      (variant: 'default' | 'a2ui') => (
        <CandlestickChart
          data={[{ close: 2, date: 'd', high: 3, low: 1, open: 1.5 }]}
          title="C"
          variant={variant}
        />
      ),
      (variant: 'default' | 'a2ui') => (
        <SankeyChart data={[{ source: 'a', target: 'b', value: 1 }]} title="S" variant={variant} />
      ),
    ];
    for (const make of cases) {
      const a = render(make('a2ui'));
      expect(a.container.querySelector('svg')).not.toBeNull();
      // The a2ui card shows the title; the default look does not.
      expect(a.container.textContent).toMatch(/[GHCS]/);
      a.unmount();
      const d = render(make('default'));
      expect(d.container.querySelector('svg')).not.toBeNull();
      expect(d.container.querySelector('figure')).toBeNull();
      d.unmount();
    }
  });

  it('ChartFrame frames custom content with a legend', () => {
    render(
      <ChartFrame legend={['A', 'B']} subtitle="sub" title="Frame">
        <div>custom</div>
      </ChartFrame>,
    );
    expect(screen.getByText('Frame')).toBeTruthy();
    expect(screen.getByText('custom')).toBeTruthy();
    expect(screen.getByText('A')).toBeTruthy();
  });

  it('ChartFrame hides a single-item legend', () => {
    render(
      <ChartFrame legend={['Only']} title="Frame">
        <div />
      </ChartFrame>,
    );
    expect(screen.queryByText('Only')).toBeNull();
  });
});
