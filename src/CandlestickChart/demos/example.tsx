import { CandlestickChart } from '@lobehub/charts';

import { prices } from './data';

export default () => (
  <CandlestickChart
    data={prices}
    format="currency"
    style={{ maxWidth: 662 }}
    subtitle="Daily OHLC, September 2026"
    title="Halvorsen Robotics (HLVR)"
  />
);
