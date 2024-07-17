import { AreaChart, AreaChartProps } from '@lobehub/charts';

const data: AreaChartProps['data'] = [
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

const valueFormatter: AreaChartProps['valueFormatter'] = (number) => {
  return '$ ' + new Intl.NumberFormat('us').format(number).toString();
};

export default () => {
  return (
    <AreaChart
      categories={['SolarPanels', 'Inverters']}
      data={data}
      index="date"
      valueFormatter={valueFormatter}
      xAxisLabel="Month of Year"
      yAxisLabel="Revenue (USD)"
      yAxisWidth={65}
    />
  );
};
