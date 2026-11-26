import { TreemapChart } from '@lobehub/charts';

import { spend } from './data';

export default () => (
  <TreemapChart
    data={spend}
    format="currency"
    height={200}
    style={{ maxWidth: 662 }}
    subtitle="Last 30 days, USD"
    title="Cloud spend by service"
  />
);
