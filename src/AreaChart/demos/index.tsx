import { AreaChart, AreaChartProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { FC } from 'react';

const data: AreaChartProps['data'] = [
  {
    date: 'Jan 22',
    inverters: 2338,
    solarPanels: 2890,
  },
  {
    date: 'Feb 22',
    inverters: 2103,
    solarPanels: 2756,
  },
  {
    date: 'Mar 22',
    inverters: 2194,
    solarPanels: 3322,
  },
  {
    date: 'Apr 22',
    inverters: 2108,
    solarPanels: 3470,
  },
  {
    date: 'May 22',
    inverters: 1812,
    solarPanels: 3475,
  },
  {
    date: 'Jun 22',
    inverters: 1726,
    solarPanels: 3129,
  },
  {
    date: 'Jul 22',
    inverters: 1982,
    solarPanels: 3490,
  },
  {
    date: 'Aug 22',
    inverters: 2012,
    solarPanels: 2903,
  },
  {
    date: 'Sep 22',
    inverters: 2342,
    solarPanels: 2643,
  },
  {
    date: 'Oct 22',
    inverters: 2473,
    solarPanels: 2837,
  },
  {
    date: 'Nov 22',
    inverters: 3848,
    solarPanels: 2954,
  },
  {
    date: 'Dec 22',
    inverters: 3736,
    solarPanels: 3239,
  },
];

const valueFormatter: AreaChartProps['valueFormatter'] = (number: number) =>
  `$${Intl.NumberFormat('us').format(number).toString()}`;

const Demo: FC = () => {
  const store = useCreateStore();

  const props: AreaChartProps | any = useControls(
    {
      allowDecimals: true,
      animationDuration: {
        step: 1,
        value: 900,
      },
      autoMinValue: false,
      connectNulls: false,
      enableLegendSlider: false,
      intervalType: {
        options: ['preserveStart', 'preserveEnd', 'preserveStartEnd', 'equidistantPreserveStart'],
        value: 'equidistantPreserveStart',
      },
      showAnimation: false,
      showGradient: true,
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
      <AreaChart
        categories={['solarPanels', 'inverters']}
        customCategories={{
          inverters: 'Inverters',
          solarPanels: 'Solar Panels',
        }}
        data={data}
        index={'date'}
        onValueChange={(v) => console.log(v)}
        valueFormatter={valueFormatter}
        {...props}
      />
    </StoryBook>
  );
};

Demo.displayName = 'AreaChartsDemo';

export default Demo;
