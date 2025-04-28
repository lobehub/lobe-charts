import { DonutChart, DonutChartProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

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
  const store = useCreateStore();

  const props: any = useControls(
    {
      animationDuration: {
        step: 1,
        value: 900,
      },
      label: '',
      showAnimation: false,
      showLabel: false,
      showTooltip: true,
      variant: {
        options: ['donut', 'pie'],
        value: 'donut',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <DonutChart
        category="sales"
        data={data}
        index="name"
        valueFormatter={valueFormatter}
        {...props}
      />
    </StoryBook>
  );
};
