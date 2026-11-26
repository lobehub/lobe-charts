import { GaugeChart } from '@lobehub/charts';

export default () => (
  <GaugeChart
    format="percent"
    label="of 512 GPUs busy"
    max={100}
    min={0}
    style={{ width: 'fit-content' }}
    title="GPU cluster utilization"
    value={72}
  />
);
