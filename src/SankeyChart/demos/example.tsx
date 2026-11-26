import { SankeyChart } from '@lobehub/charts';

import { funnel } from './data';

export default () => <SankeyChart data={funnel} format="compact" style={{ maxWidth: 662 }} />;
