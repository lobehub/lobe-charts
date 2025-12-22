import { BarChart, BarChartProps, EventProps } from '@lobehub/charts';
import { Flexbox, Highlighter } from '@lobehub/ui';
import { useState } from 'react';

const data: BarChartProps['data'] = [
  {
    '2022': 45,
    '2023': 78,
    'date': 'Jan 23',
  },
  {
    '2022': 52,
    '2023': 71,
    'date': 'Feb 23',
  },
  {
    '2022': 48,
    '2023': 80,
    'date': 'Mar 23',
  },
  {
    '2022': 61,
    '2023': 65,
    'date': 'Apr 23',
  },
  {
    '2022': 55,
    '2023': 58,
    'date': 'May 23',
  },
  {
    '2022': 67,
    '2023': 62,
    'date': 'Jun 23',
  },
  {
    '2022': 60,
    '2023': 54,
    'date': 'Jul 23',
  },
  {
    '2022': 72,
    '2023': 49,
    'date': 'Aug 23',
  },
  {
    '2022': 65,
    '2023': 52,
    'date': 'Sep 23',
  },
  {
    '2022': 68,
    '2023': null,
    'date': 'Oct 23',
  },
  {
    '2022': 74,
    '2023': null,
    'date': 'Nov 23',
  },
  {
    '2022': 71,
    '2023': null,
    'date': 'Dec 23',
  },
];

export default () => {
  const [value, setValue] = useState<EventProps>(null);
  return (
    <Flexbox>
      <h4>Closed Pull Requests</h4>
      <BarChart
        categories={['2022', '2023']}
        data={data}
        index="date"
        onValueChange={(v) => setValue(v)}
      />
      <Highlighter language={'json'} style={{ marginTop: 16 }}>
        {JSON.stringify(value, null, 2)}
      </Highlighter>
    </Flexbox>
  );
};
