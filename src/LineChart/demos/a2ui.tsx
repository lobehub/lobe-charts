import { LineChart } from '@lobehub/charts';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const web = [
  18_200, 19_400, 21_100, 20_800, 23_900, 26_400, 25_800, 28_900, 31_200, 33_800, 35_100, 38_400,
];
const mobile = [
  9800, 10_900, 12_600, 14_100, 15_900, 17_200, 19_800, 21_400, 24_100, 26_900, 29_300, 32_600,
];

const data = months.map((month, i) => ({ Mobile: mobile[i], Web: web[i], month }));

export default () => (
  <LineChart
    categories={['Web', 'Mobile']}
    data={data}
    format="compact"
    index="month"
    style={{ maxWidth: 662 }}
    subtitle="Web vs mobile, last 12 months"
    title="Weekly active users"
    variant="a2ui"
  />
);
