import { ScatterChart } from '@lobehub/charts';

const data = [
  { latency: 84, name: 'api-gateway', region: 'us-east', replicas: 2, rps: 120 },
  { latency: 112, name: 'search', region: 'us-east', replicas: 4, rps: 340 },
  { latency: 168, name: 'checkout', region: 'us-east', replicas: 8, rps: 610 },
  { latency: 241, name: 'catalog', region: 'us-east', replicas: 12, rps: 880 },
  { latency: 64, name: 'auth', region: 'eu-west', replicas: 3, rps: 210 },
  { latency: 98, name: 'search', region: 'eu-west', replicas: 5, rps: 450 },
  { latency: 132, name: 'checkout', region: 'eu-west', replicas: 9, rps: 720 },
  { latency: 188, name: 'catalog', region: 'eu-west', replicas: 14, rps: 960 },
  { latency: 142, name: 'search', region: 'ap-south', replicas: 2, rps: 300 },
  { latency: 205, name: 'checkout', region: 'ap-south', replicas: 6, rps: 520 },
  { latency: 262, name: 'catalog', region: 'ap-south', replicas: 7, rps: 690 },
];

export default () => (
  <ScatterChart
    category="region"
    data={data}
    label="name"
    size="replicas"
    style={{ maxWidth: 560 }}
    subtitle="Per deployment, bubble size is replica count"
    title="Latency vs throughput"
    unit="ms"
    variant="a2ui"
    x="rps"
    xAxisLabel="Requests / s"
    y="latency"
    yAxisLabel="p95 latency"
  />
);
