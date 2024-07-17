import { BarChart, BarChartProps } from '@lobehub/charts';
import { Flexbox } from 'react-layout-kit';

const data: BarChartProps['data'] = [
  {
    groupA: 890,
    groupB: 338,
    groupC: 538,
    groupD: 396,
    groupE: 138,
    groupF: 436,
    name: 'Topic 1',
  },
  {
    groupA: 289,
    groupB: 233,
    groupC: 253,
    groupD: 333,
    groupE: 133,
    groupF: 533,
    name: 'Topic 2',
  },
  {
    groupA: 380,
    groupB: 535,
    groupC: 352,
    groupD: 718,
    groupE: 539,
    groupF: 234,
    name: 'Topic 3',
  },
  {
    groupA: 90,
    groupB: 98,
    groupC: 28,
    groupD: 33,
    groupE: 61,
    groupF: 53,
    name: 'Topic 4',
  },
];

const valueFormatter: BarChartProps['valueFormatter'] = (number: number) =>
  Intl.NumberFormat('us').format(number).toString();

export default () => {
  return (
    <Flexbox>
      <h4>Writing Contest: Entries</h4>
      <BarChart
        categories={['groupA', 'groupB', 'groupC', 'groupD', 'groupE', 'groupF']}
        data={data}
        index="name"
        valueFormatter={valueFormatter}
        yAxisWidth={48}
      />
    </Flexbox>
  );
};
