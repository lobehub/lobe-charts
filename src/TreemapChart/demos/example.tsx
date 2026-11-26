import { TreemapChart } from '@lobehub/charts';

import { spend } from './data';

export default () => (
  <TreemapChart data={spend} format="currency" height={200} style={{ maxWidth: 662 }} />
);
