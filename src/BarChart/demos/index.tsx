import type { BarChartProps } from '@lobehub/charts';
import { BarChart } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import type { FC } from 'react';

const data: BarChartProps['data'] = [
  {
    groupA: 890,
    groupB: 338,

    name: 'Topic 1sdafsdafsd',
  },
  {
    groupA: 289,
    groupB: 233,

    name: 'Topic 2',
  },
  {
    groupA: 380,
    groupB: 535,

    name: 'Topic 3',
  },
  {
    groupA: 90,
    groupB: 98,

    name: 'Topic 4',
  },
];

const valueFormatter: BarChartProps['valueFormatter'] = (number) =>
  Intl.NumberFormat('us').format(number).toString();

const BarChartDemo: FC = () => {
  const store = useCreateStore();

  const props: BarChartProps | any = useControls(
    {
      allowDecimals: true,
      animationDuration: {
        step: 1,
        value: 900,
      },
      autoMinValue: false,
      barCategoryGap: 10,
      enableLegendSlider: false,

      intervalType: {
        options: ['preserveStart', 'preserveEnd', 'preserveStartEnd', 'equidistantPreserveStart'],
        value: 'equidistantPreserveStart',
      },
      layout: {
        options: ['horizontal', 'vertical'],
        value: 'horizontal',
      },
      maxValue: 1000,
      minValue: 0,
      showAnimation: false,
      showGridLines: true,
      showLegend: true,
      showTooltip: true,
      showXAxis: true,
      showYAxis: true,
      stack: false,
      startEndOnly: false,
      tickGap: {
        step: 1,
        value: 5,
      },
      xAxisLabel: '',
      yAxisAlign: {
        options: ['left', 'right'],
        value: 'left',
      },
      yAxisLabel: '',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <BarChart
        categories={['groupA', 'groupB']}
        data={data}
        index={'name'}
        valueFormatter={valueFormatter}
        customCategories={{
          groupA: 'Group A',
          groupB: 'Group B',
        }}
        onValueChange={(v) => console.info(v)}
        {...props}
      />
    </StoryBook>
  );
};

BarChartDemo.displayName = 'BarChartDemo';

export default BarChartDemo;
