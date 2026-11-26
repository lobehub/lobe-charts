import { GaugeChart } from '@lobehub/charts';

export default () => (
  <GaugeChart
    format="percent"
    label="of 512 GPUs busy"
    max={100}
    min={0}
    style={{ maxWidth: 240 }}
    value={72}
  />
);
