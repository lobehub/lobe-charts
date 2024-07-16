import { LineChart } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';

const chartdata = [
  {
    Inverters: 2338,
    SolarPanels: 2890,
    date: 'Jan 22',
  },
  {
    Inverters: 2103,
    SolarPanels: 2756,
    date: 'Feb 22',
  },
  {
    Inverters: 2194,
    SolarPanels: 3322,
    date: 'Mar 22',
  },
  {
    Inverters: 2108,
    SolarPanels: 3470,
    date: 'Apr 22',
  },
  {
    Inverters: 1812,
    SolarPanels: 3475,
    date: 'May 22',
  },
  {
    Inverters: 1726,
    SolarPanels: 3129,
    date: 'Jun 22',
  },
  {
    Inverters: 1982,
    SolarPanels: 3490,
    date: 'Jul 22',
  },
  {
    Inverters: 2012,
    SolarPanels: 2903,
    date: 'Aug 22',
  },
  {
    Inverters: 2342,
    SolarPanels: 2643,
    date: 'Sep 22',
  },
  {
    Inverters: 2473,
    SolarPanels: 2837,
    date: 'Oct 22',
  },
  {
    Inverters: 3848,
    SolarPanels: 2954,
    date: 'Nov 22',
  },
  {
    Inverters: 3736,
    SolarPanels: 3239,
    date: 'Dec 22',
  },
];

const dataFormatter = (number: number) => `$${Intl.NumberFormat('us').format(number).toString()}`;

export default () => {
  const store = useCreateStore();

  const props: any = useControls(
    {
      allowDecimals: true,
      animationDuration: {
        step: 1,
        value: 900,
      },
      autoMinValue: false,
      barCategoryGap: 10,
      connectNulls: false,
      enableLegendSlider: false,
      intervalType: {
        options: ['preserveStart', 'preserveEnd', 'preserveStartEnd', 'equidistantPreserveStart'],
        value: 'equidistantPreserveStart',
      },
      layout: {
        options: ['horizontal', 'vertical'],
        value: 'horizontal',
      },
      relative: false,
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
      yAxisLabel: '',
      yAxisWidth: {
        step: 1,
        value: 60,
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <LineChart
        categories={['SolarPanels', 'Inverters']}
        data={chartdata}
        index={'date'}
        onValueChange={(v) => console.log(v)}
        valueFormatter={dataFormatter}
        {...props}
      />
    </StoryBook>
  );
};
