import { SparkAreaChart, SparkBarChart, SparkLineChart } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

const values = [128, 131, 129, 138, 142, 140, 149, 155, 153, 162, 171, 168, 176, 184];
const data = values.map((mrr, week) => ({ mrr, week: `W${week + 1}` }));
const latency = [212, 205, 219, 230, 226, 241, 238, 252, 249, 261, 258, 266];
const latencyData = latency.map((p95, i) => ({ day: i + 1, p95 }));

export default () => (
  <Flexbox gap={12} style={{ maxWidth: 560 }} width={'100%'}>
    <SparkAreaChart
      categories={['mrr']}
      data={data}
      delta="+12.4%"
      index="week"
      label="Monthly recurring revenue"
      tone="positive"
      value="$184.2K"
      variant="a2ui"
    />
    <SparkLineChart
      categories={['p95']}
      data={latencyData}
      delta="+25.5%"
      index="day"
      label="p95 latency"
      tone="negative"
      unit="ms"
      variant="a2ui"
    />
    <SparkBarChart
      categories={['mrr']}
      data={data}
      delta="+43.8%"
      format="currency"
      index="week"
      label="Weekly new MRR (K)"
      variant="a2ui"
    />
  </Flexbox>
);
