import { DonutChart, Legend } from '@lobehub/charts';
import { Flexbox } from 'react-layout-kit';

const sales = [
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

const valueFormatter = (number: number) => `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export default () => {
  return (
    <Flexbox align={'center'} gap={24} justify={'center'}>
      <Legend categories={['New York', 'London', 'Hong Kong', 'San Francisco', 'Singapore']} />
      <DonutChart category="sales" data={sales} index="name" valueFormatter={valueFormatter} />
    </Flexbox>
  );
};
