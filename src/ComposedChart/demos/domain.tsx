import { ComposedChart, ComposedChartProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

const data: ComposedChartProps['data'] = [
  { month: 'Jan', successRate: 82.4, total: 12_400 },
  { month: 'Feb', successRate: 85.1, total: 15_200 },
  { month: 'Mar', successRate: 87.6, total: 14_800 },
  { month: 'Apr', successRate: 89.2, total: 18_600 },
  { month: 'May', successRate: 91.5, total: 21_300 },
  { month: 'Jun', successRate: 93.8, total: 20_100 },
];

const series: ComposedChartProps['series'] = [
  { axis: 'left', key: 'total', name: 'Requests', type: 'bar' },
  { axis: 'right', key: 'successRate', name: 'Success Rate (%)', type: 'line' },
];

export default () => (
  <Flexbox gap={32} horizontal wrap="wrap">
    <Flexbox flex={1} style={{ minWidth: 300 }}>
      <h4 style={{ margin: '0 0 8px' }}>Default — right axis from 0%</h4>
      <ComposedChart
        data={data}
        height={280}
        index="month"
        series={series}
        yAxisLeft={{ valueFormatter: (v) => v.toLocaleString() }}
        yAxisRight={{ valueFormatter: (v) => `${v.toFixed(1)}%` }}
      />
    </Flexbox>
    <Flexbox flex={1} style={{ minWidth: 300 }}>
      <h4 style={{ margin: '0 0 8px' }}>Custom domain — zoomed to data range</h4>
      <ComposedChart
        data={data}
        height={280}
        index="month"
        series={series}
        yAxisLeft={{ valueFormatter: (v) => v.toLocaleString() }}
        yAxisRight={{
          domain: [(dataMin: number) => Math.max(0, dataMin - 5), 100],
          valueFormatter: (v) => `${v.toFixed(1)}%`,
        }}
      />
    </Flexbox>
  </Flexbox>
);
