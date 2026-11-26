import { GaugeChart } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

export default () => (
  <Flexbox horizontal gap={12} wrap="wrap">
    <GaugeChart
      format="currency"
      label="of monthly budget"
      max={20_000}
      style={{ width: 220 }}
      value={12_480}
    />
    <GaugeChart format="percent" label="disk used" style={{ width: 220 }} value={94} />
  </Flexbox>
);
