import { CandlestickChart } from '@lobehub/charts';

import { prices } from './data';

export default () => <CandlestickChart data={prices} format="currency" style={{ maxWidth: 662 }} />;
