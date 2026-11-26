import { HeatmapChart } from '@lobehub/charts';

import { requests } from './data';

export default () => (
  <HeatmapChart
    data={requests}
    format="compact"
    style={{ maxWidth: 662 }}
    subtitle="Average per 3h window, last 4 weeks (UTC)"
    title="API requests by hour"
    value="requests"
    x="hour"
    y="day"
  />
);
