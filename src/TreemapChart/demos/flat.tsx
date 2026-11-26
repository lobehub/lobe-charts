import { TreemapChart } from '@lobehub/charts';

const data = [
  { name: 'TypeScript', share: 41 },
  { name: 'Python', share: 24 },
  { name: 'Go', share: 12 },
  { name: 'Rust', share: 9 },
  { name: 'Swift', share: 6 },
  { name: 'Other', share: 8 },
];

export default () => (
  <TreemapChart
    category="share"
    data={data}
    format="percent"
    height={200}
    style={{ maxWidth: 560 }}
  />
);
