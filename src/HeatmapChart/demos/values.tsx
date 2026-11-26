import { HeatmapChart, useThemeColorRange } from '@lobehub/charts';

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

export default () => {
  const colors = useThemeColorRange();
  return (
    <HeatmapChart
      color={colors[2]}
      data={data}
      format="percent"
      style={{ maxWidth: 560 }}
      value="score"
      x="task"
      y="model"
    />
  );
};
