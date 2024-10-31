import dayjs from 'dayjs';

import { BarChart } from '@/index';

const data = [
  {
    count: 213,
    date: '2024-10-22',
  },
  {
    count: 256,
    date: '2024-10-23',
  },
  {
    count: 220,
    date: '2024-10-24',
  },
  {
    count: 193,
    date: '2024-10-25',
  },
  {
    count: 158,
    date: '2024-10-26',
  },
  {
    count: 200,
    date: '2024-10-27',
  },
  {
    count: 196,
    date: '2024-10-28',
  },
];

export default () => {
  return (
    <BarChart
      categories={['count']}
      data={data}
      index="date"
      xAxisLabelFormatter={(v) => dayjs(v).format('MM-DD')}
    />
  );
};
