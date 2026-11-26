import { HeatmapChart } from '@lobehub/charts';

import { requests } from './data';

export default () => (
  <HeatmapChart
    data={requests}
    format="compact"
    style={{ maxWidth: 662 }}
    value="requests"
    x="hour"
    y="day"
  />
);
