import type { StockTickerProps } from '@lobehub/charts';

export const kestrel: StockTickerProps = {
  change: 3.21,
  changePct: 1.79,
  currency: 'USD',
  name: 'Kestrel Robotics Inc.',
  price: 182.47,
  sample: true,
  series: [
    176.2, 177.1, 176.4, 178.3, 177.9, 179.6, 179.1, 180.4, 179.8, 181.2, 180.6, 181.9, 182.8,
    182.1, 182.47,
  ],
  stats: [
    { label: 'Open', value: '179.40' },
    { label: 'High', value: '183.12' },
    { label: 'Low', value: '178.95' },
    { label: 'Volume', value: '24.1M' },
    { label: 'Mkt cap', value: '412B' },
    { label: 'P/E', value: '31.4' },
  ],
  symbol: 'HLVR',
};
