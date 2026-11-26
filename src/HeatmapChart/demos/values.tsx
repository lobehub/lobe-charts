import { HeatmapChart } from '@lobehub/charts';

const models = ['GPT', 'Claude', 'Gemini', 'Llama'];
const tasks = ['Code', 'Math', 'Docs', 'Chat', 'Agents'];
const scores = [
  [82, 64, 71, 88, 59],
  [91, 70, 84, 86, 77],
  [78, 75, 80, 83, 62],
  [61, 49, 66, 72, 41],
];

const data = models.flatMap((model, mi) =>
  tasks.map((task, ti) => ({ model, score: scores[mi][ti], task })),
);

export default () => (
  <HeatmapChart
    color="var(--a2-chart-3)"
    data={data}
    format="percent"
    style={{ maxWidth: 560 }}
    subtitle="Pass rate per task"
    title="Eval matrix"
    value="score"
    x="task"
    y="model"
  />
);
