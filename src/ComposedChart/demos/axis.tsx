import { ComposedChart, ComposedChartProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

const data: ComposedChartProps['data'] = [
  { month: 'Jan', revenue: 42_000, successRate: 94.2 },
  { month: 'Feb', revenue: 51_000, successRate: 96.1 },
  { month: 'Mar', revenue: 48_000, successRate: 95.5 },
  { month: 'Apr', revenue: 63_000, successRate: 97.3 },
  { month: 'May', revenue: 71_000, successRate: 98 },
  { month: 'Jun', revenue: 68_000, successRate: 97.8 },
];

export default () => (
  <Flexbox>
    <h4 style={{ margin: '0 0 12px' }}>Dual axes with labels</h4>
    <ComposedChart
      data={data}
      height={320}
      index="month"
      series={[
        { axis: 'left', key: 'revenue', name: 'Revenue', type: 'bar' },
        { axis: 'right', key: 'successRate', name: 'Success Rate (%)', type: 'line' },
      ]}
      xAxisLabel="Month"
      yAxisLeft={{ label: 'Revenue (USD)', valueFormatter: (v) => `$${(v / 1000).toFixed(0)}k` }}
      yAxisRight={{
        domain: [(dataMin: number) => Math.max(0, dataMin - 5), 100],
        label: 'Success Rate (%)',
        valueFormatter: (v) => `${v}%`,
      }}
    />
  </Flexbox>
);
