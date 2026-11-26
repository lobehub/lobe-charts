import { SankeyChart } from '@lobehub/charts';

const data = [
  { from: 'Revenue', to: 'Gross profit', usd: 7.4 },
  { from: 'Revenue', to: 'Cost of revenue', usd: 2.6 },
  { from: 'Gross profit', to: 'R&D', usd: 3.1 },
  { from: 'Gross profit', to: 'Sales & marketing', usd: 2.2 },
  { from: 'Gross profit', to: 'G&A', usd: 0.9 },
  { from: 'Gross profit', to: 'Operating profit', usd: 1.2 },
];

export default () => (
  <SankeyChart
    data={data}
    format="currency"
    height={240}
    source="from"
    style={{ maxWidth: 662 }}
    target="to"
    value="usd"
  />
);
