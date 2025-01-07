import { BarChart, BarChartProps } from '@lobehub/charts';
import { Flexbox } from 'react-layout-kit';

const data: BarChartProps['data'] = [
  {
    'Number of threatened species': 2488,
    'name': 'Amphibians',
  },
  {
    'Number of threatened species': 1445,
    'name': 'Birds',
  },
  {
    'Number of threatened species': 743,
    'name': 'Crustaceans',
  },
  {
    'Number of threatened species': 281,
    'name': 'Ferns',
  },
  {
    'Number of threatened species': 251,
    'name': 'Arachnids',
  },
  {
    'Number of threatened species': 232,
    'name': 'Corals',
  },
  {
    'Number of threatened species': 98,
    'name': 'Algae',
  },
];

const valueFormatter: BarChartProps['valueFormatter'] = (number) =>
  Intl.NumberFormat('us').format(number).toString();

export default () => {
  return (
    <Flexbox>
      <h4>Number of species threatened with extinction (2021)</h4>
      <BarChart
        categories={['Number of threatened species']}
        data={data}
        index="name"
        valueFormatter={valueFormatter}
      />
    </Flexbox>
  );
};
