import { Heatmaps } from '@lobehub/charts';

import { yearData } from './data';

export default () => {
  return <Heatmaps blockMargin={4} blockRadius={4} blockSize={8} data={yearData} fontSize={12} />;
};
