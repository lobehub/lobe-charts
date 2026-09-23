import type { BenchmarkRecord, BenchmarkScatterMetric } from '@lobehub/charts';

export const harnessData: BenchmarkRecord[] = [
  { cost: 3.47, name: 'Codex', provider: 'OpenAI', score: 66.7, time: 403 },
  { cost: 3.28, name: 'DSH Creator', provider: 'DeepSeek', score: 63.3, time: 404 },
  { cost: 18.34, name: 'Claude Code', provider: 'Anthropic', score: 63.3, time: 578 },
  { cost: 2.43, name: 'Pi', provider: 'Pi', score: 60, time: 453 },
  { cost: 4.58, name: 'DSH PTC', provider: 'DeepSeek', score: 60, time: 464 },
  { cost: 3.46, name: 'DSH Standard', provider: 'DeepSeek', score: 60, time: 377 },
  { cost: 4.75, name: 'Oh My Pi', provider: 'Pi', score: 56.7, time: 406 },
  { cost: 3.65, name: 'Kimi Code', provider: 'Moonshot', score: 56.7, time: 476 },
  { cost: 4.72, name: 'DSH Minimal', provider: 'DeepSeek', score: 56.7, time: 341 },
  { cost: 1.05, name: 'Exo Harness', provider: 'Exo', score: 53.3, time: 377 },
  { cost: 3.24, name: 'OpenCode', provider: 'SST', score: 50, time: 387 },
  { cost: 2.9, name: 'Hermes', provider: 'Nous Research', score: 50, time: 418 },
];

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
};

export const harnessMetrics: BenchmarkScatterMetric[] = [
  {
    axisLabel: 'Median cost per task',
    formatter: (v) => `$${Number(v.toFixed(2))}`,
    key: 'cost',
    label: 'Cost',
    scale: 'log',
  },
  {
    axisLabel: 'Median time per task',
    formatter: formatDuration,
    key: 'time',
    label: 'Speed',
  },
];

export const passRateFormatter = (v: number) => `${v.toFixed(1)}%`;
