import { DonutChart, DonutChartProps } from '@lobehub/charts';
import { useTheme } from 'antd-style';

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
  {
    name: 'Zurich',
    sales: 139,
  },
];

export default () => {
  const theme = useTheme();
  return (
    <DonutChart
      category="sales"
      colors={[theme.purple, theme.cyan, theme.green, theme.orange, theme.colorPrimary, '#ffcc33']}
      data={data}
      index="name"
    />
  );
};
