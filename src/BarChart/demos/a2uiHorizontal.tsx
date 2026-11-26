import { BarChart } from '@lobehub/charts';

const data = [
  { model: 'Reasoning', score: 92 },
  { model: 'Coding', score: 88 },
  { model: 'Tool use', score: 90 },
  { model: 'Math', score: 85 },
  { model: 'Long context', score: 78 },
];

export default () => (
  <BarChart
    categories={['score']}
    data={data}
    format="percent"
    index="model"
    layout="vertical"
    style={{ maxWidth: 560 }}
    subtitle="Share of tasks solved"
    title="Eval pass rate"
    variant="a2ui"
  />
);
