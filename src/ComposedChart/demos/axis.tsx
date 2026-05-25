import { ComposedChart, ComposedChartProps } from '@lobehub/charts';

const data: ComposedChartProps['data'] = [
  { month: 'Jan', revenue: 42_000, successRate: 94.2 },
  { month: 'Feb', revenue: 51_000, successRate: 96.1 },
  { month: 'Mar', revenue: 48_000, successRate: 95.5 },
  { month: 'Apr', revenue: 63_000, successRate: 97.3 },
  { month: 'May', revenue: 71_000, successRate: 98.0 },
  { month: 'Jun', revenue: 68_000, successRate: 97.8 },
];

export default () => (
  <ComposedChart
    data={data}
    index="month"
    series={[
      { axis: 'left', key: 'revenue', name: 'Revenue', type: 'bar' },
      { axis: 'right', key: 'successRate', name: 'Success Rate (%)', type: 'line' },
    ]}
    xAxisLabel="Month"
    yAxisLeft={{ label: 'Revenue (USD)', valueFormatter: (v) => `$${(v / 1000).toFixed(0)}k` }}
    yAxisRight={{ label: 'Success Rate (%)', valueFormatter: (v) => `${v}%` }}
  />
);
