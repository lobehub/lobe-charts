import { BarChart } from '@lobehub/charts';

const data = [
  { '2025': 412_000, '2026': 538_000, 'region': 'NA' },
  { '2025': 298_000, '2026': 371_000, 'region': 'EMEA' },
  { '2025': 186_000, '2026': 262_000, 'region': 'APAC' },
  { '2025': 94_000, '2026': 131_000, 'region': 'LATAM' },
];

export default () => (
  <BarChart
    categories={['2025', '2026']}
    data={data}
    format="currency"
    index="region"
    style={{ maxWidth: 560 }}
    subtitle="Quarterly, USD"
    title="Revenue by region"
    variant="a2ui"
  />
);
