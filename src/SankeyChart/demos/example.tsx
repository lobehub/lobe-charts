import { SankeyChart } from '@lobehub/charts';

import { funnel } from './data';

export default () => (
  <SankeyChart
    data={funnel}
    format="compact"
    style={{ maxWidth: 662 }}
    subtitle="Visitors to paid accounts, last quarter"
    title="Signup funnel"
  />
);
