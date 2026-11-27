import { StockTicker } from '@lobehub/charts';

export default () => (
  <StockTicker
    change={-4.86}
    changePct={-2.31}
    currency="EUR"
    locale="de-DE"
    name="Nordwind Energie AG"
    price={205.6}
    series={[214.2, 213.1, 213.8, 211.5, 210.9, 209.4, 210.2, 207.7, 206.9, 205.6]}
    style={{ maxWidth: 420 }}
    symbol="NWE"
    stats={[
      { label: 'Open', value: '210,46' },
      { label: 'Volume', value: '3,2 Mio.' },
    ]}
  />
);
