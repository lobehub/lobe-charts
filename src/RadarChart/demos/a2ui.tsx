import { RadarChart } from '@lobehub/charts';

const data = [
  { 'axis': 'Reasoning', 'Model A': 92, 'Model B': 81 },
  { 'axis': 'Coding', 'Model A': 88, 'Model B': 79 },
  { 'axis': 'Math', 'Model A': 85, 'Model B': 72 },
  { 'axis': 'Tool use', 'Model A': 90, 'Model B': 84 },
  { 'axis': 'Long context', 'Model A': 78, 'Model B': 91 },
  { 'axis': 'Latency', 'Model A': 64, 'Model B': 88 },
];

export default () => (
  <RadarChart
    categories={['Model A', 'Model B']}
    data={data}
    index="axis"
    maxValue={100}
    style={{ maxWidth: 560 }}
    subtitle="Score out of 100 per benchmark"
    title="Model eval profile"
    variant="a2ui"
  />
);
