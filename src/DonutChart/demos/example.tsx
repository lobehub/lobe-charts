import { DonutChart } from '@lobehub/charts';
import { Flexbox } from 'react-layout-kit';

const datahero = [
  {
    name: 'Noche Holding AG',
    value: 9800,
  },
  {
    name: 'Rain Drop AG',
    value: 4567,
  },
  {
    name: 'Push Rail AG',
    value: 3908,
  },
  {
    name: 'Flow Steal AG',
    value: 2400,
  },
  {
    name: 'Tiny Loop Inc.',
    value: 2174,
  },
  {
    name: 'Anton Resorts Holding',
    value: 1398,
  },
];

const dataFormatter = (number: number) => `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export default () => (
  <Flexbox align={'center'} gap={8}>
    <h4>Donut Variant</h4>
    <DonutChart
      data={datahero}
      onValueChange={(v) => console.log(v)}
      valueFormatter={dataFormatter}
      variant="donut"
    />
    <h4>Pie Variant</h4>
    <DonutChart
      data={datahero}
      onValueChange={(v) => console.log(v)}
      valueFormatter={dataFormatter}
      variant="pie"
    />
  </Flexbox>
);
