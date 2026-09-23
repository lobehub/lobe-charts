import { type BenchmarkRecord, BenchmarkScatterChart } from '@lobehub/charts';

import { harnessData, passRateFormatter } from './data';

const shapes: Record<string, Pick<BenchmarkRecord, 'color' | 'shape'>> = {
  'Claude Code': { color: '#f0a984', shape: 'diamond' },
  'Codex': { color: '#a78bfa', shape: 'circle' },
  'DSH Creator': { color: '#60a5fa', shape: 'triangle' },
  'DSH Minimal': { color: '#60a5fa', shape: 'circle' },
  'DSH PTC': { color: '#60a5fa', shape: 'diamond' },
  'DSH Standard': { color: '#60a5fa', shape: 'square' },
  'Exo Harness': { color: '#d4d4d4', shape: 'circle' },
  'Hermes': { color: '#a3a3a3', shape: 'triangle' },
  'Kimi Code': { color: '#6ee7b7', shape: 'circle' },
  'Oh My Pi': { color: '#fb923c', shape: 'circle' },
  'OpenCode': { color: '#c084fc', shape: 'square' },
  'Pi': { color: '#f5f5f5', shape: 'square' },
};

const data = harnessData.map((record) => ({ ...record, ...shapes[record.name as string] }));

export default () => (
  <BenchmarkScatterChart
    accuracyFormatter={passRateFormatter}
    data={data}
    height={400}
    markerSize={12}
    xAxisLabel="Median cost per task"
    xFormatter={(v) => `$${Number(v.toFixed(2))}`}
    xKey="cost"
    xScale="log"
    yAxisLabel="Pass rate"
  />
);
