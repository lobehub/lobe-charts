import { SparkAreaChart, SparkBarChart, SparkLineChart } from '@lobehub/charts';
import { Flexbox } from 'react-layout-kit';

const data = [
  {
    Benchmark: 3000,
    Performance: 4000,
    month: 'Jan 21',
  },
  {
    Benchmark: 2000,
    Performance: 3000,
    month: 'Feb 21',
  },
  {
    Benchmark: 1700,
    Performance: 2000,
    month: 'Mar 21',
  },
  {
    Benchmark: 2500,
    Performance: 2780,
    month: 'Apr 21',
  },
  {
    Benchmark: 1890,
    Performance: 1890,
    month: 'May 21',
  },
  {
    Benchmark: 2000,
    Performance: 2390,
    month: 'Jun 21',
  },
  {
    Benchmark: 3000,
    Performance: 3490,
    month: 'Jul 21',
  },
];

export default () => {
  return (
    <Flexbox align={'center'} gap={16} horizontal justify={'center'} wrap={'wrap'}>
      <SparkAreaChart categories={['Performance', 'Benchmark']} data={data} index="date" />
      <SparkLineChart categories={['Performance', 'Benchmark']} data={data} index="date" />
      <SparkBarChart categories={['Performance', 'Benchmark']} data={data} index="date" />
    </Flexbox>
  );
};
