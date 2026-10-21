import { ComposedChart } from '@lobehub/charts';

export default () => (
  <ComposedChart
    loading
    data={[]}
    index="bucket"
    series={[
      { axis: 'left', key: 'ops', type: 'bar' },
      { axis: 'right', key: 'cost', type: 'line' },
    ]}
  />
);
