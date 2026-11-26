import { DonutChart } from '@lobehub/charts';

const data = [
  { name: 'Organic search', value: 48_200 },
  { name: 'Direct', value: 27_100 },
  { name: 'Referral', value: 14_600 },
  { name: 'Social', value: 9800 },
  { name: 'Email', value: 5300 },
];

export default () => (
  <DonutChart
    centerLabel="sessions"
    data={data}
    format="compact"
    style={{ maxWidth: 560 }}
    subtitle="Sessions, last 30 days"
    title="Traffic sources"
    variant="a2ui"
  />
);
