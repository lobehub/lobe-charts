import { DonutChart, DonutChartProps, Legend } from '@lobehub/charts';
import { Flexbox } from 'react-layout-kit';

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
  return (
    <Flexbox align={'center'} gap={24} justify={'center'}>
      <Legend categories={['New York', 'London', 'Hong Kong', 'San Francisco', 'Singapore']} />
      <DonutChart category="sales" data={data} index="name" valueFormatter={valueFormatter} />
    </Flexbox>
  );
};
