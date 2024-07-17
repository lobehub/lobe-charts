import { Heatmaps } from '@lobehub/charts';
import { Flexbox } from 'react-layout-kit';

import { monthData, weekData, yearData } from './data';

export default () => (
  <Flexbox gap={24}>
    <Heatmaps data={yearData} />
    <Heatmaps data={monthData} />
    <Heatmaps data={weekData} />
  </Flexbox>
);
