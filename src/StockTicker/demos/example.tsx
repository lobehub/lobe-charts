import { StockTicker } from '@lobehub/charts';

import { kestrel } from './data';

export default () => <StockTicker {...kestrel} style={{ maxWidth: 560 }} />;
