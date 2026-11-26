import { ChartFrame, SparkAreaChart } from '@lobehub/charts';

const data = [12, 14, 13, 17, 19, 18, 22, 25, 24, 28].map((v, i) => ({ day: i, v }));

export default () => (
  <ChartFrame
    footer={<div style={{ color: 'var(--a2-muted-fg)', fontSize: 11.5 }}>Sampled every minute</div>}
    style={{ maxWidth: 560 }}
    subtitle="Requests per second, last 10 minutes"
    title="Gateway throughput"
    aside={
      <div style={{ color: 'var(--a2-positive)', fontSize: 12, fontWeight: 500, textAlign: 'end' }}>
        +133% vs. 10 min ago
      </div>
    }
  >
    <SparkAreaChart categories={['v']} data={data} height={80} index="day" width="100%" />
  </ChartFrame>
);
