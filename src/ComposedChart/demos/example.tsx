import { ComposedChart, ComposedChartProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

const data: ComposedChartProps['data'] = [
  { bucket: '0–1k', cost: 12.4, ops: 1200 },
  { bucket: '1k–2k', cost: 28.7, ops: 2850 },
  { bucket: '2k–5k', cost: 54.1, ops: 5400 },
  { bucket: '5k–10k', cost: 87.3, ops: 8730 },
  { bucket: '10k–20k', cost: 132.5, ops: 13_250 },
  { bucket: '20k–50k', cost: 198.6, ops: 19_860 },
  { bucket: '50k+', cost: 320.0, ops: 32_000 },
];

export default () => (
  <Flexbox>
    <h4>Token bucket distribution — requests vs cost</h4>
    <ComposedChart
      data={data}
      height={320}
      index="bucket"
      series={[
        { axis: 'left', key: 'ops', name: 'Requests', type: 'bar' },
        { axis: 'right', key: 'cost', name: 'Cost (USD)', type: 'line' },
      ]}
      yAxisLeft={{ valueFormatter: (v) => v.toLocaleString() }}
      yAxisRight={{ valueFormatter: (v) => `$${v.toFixed(2)}` }}
    />
  </Flexbox>
);
