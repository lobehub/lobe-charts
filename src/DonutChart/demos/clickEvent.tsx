import { DonutChart, DonutChartProps, EventProps } from '@lobehub/charts';
import { Flexbox, Highlighter } from '@lobehub/ui';
import { useState } from 'react';

const data: DonutChartProps['data'] = [
  {
    name: 'New York',
    sales: 980,
  },
  {
    name: 'London',
    sales: 456,
  },
  {
    name: 'Hong Kong',
    sales: 390,
  },
  {
    name: 'San Francisco',
    sales: 240,
  },
  {
    name: 'Singapore',
    sales: 190,
  },
];

const valueFormatter: DonutChartProps['valueFormatter'] = (number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export default () => {
  const [value, setValue] = useState<EventProps>(null);
  return (
    <Flexbox>
      <DonutChart
        category="sales"
        data={data}
        index="name"
        onValueChange={(v) => setValue(v)}
        valueFormatter={valueFormatter}
      />
      <Highlighter language={'json'} style={{ marginTop: 16 }}>
        {JSON.stringify(value, null, 2)}
      </Highlighter>
    </Flexbox>
  );
};
