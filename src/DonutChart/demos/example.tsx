import { DonutChart, DonutChartProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

const data: DonutChartProps['data'] = [
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

const valueFormatter: DonutChartProps['valueFormatter'] = (number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export default () => (
  <Flexbox align={'center'} gap={8}>
    <h4>Donut Variant</h4>
    <DonutChart
      data={data}
      onValueChange={(v) => console.log(v)}
      valueFormatter={valueFormatter}
      variant="donut"
    />
    <h4>Pie Variant</h4>
    <DonutChart
      data={data}
      onValueChange={(v) => console.log(v)}
      valueFormatter={valueFormatter}
      variant="pie"
    />
  </Flexbox>
);
