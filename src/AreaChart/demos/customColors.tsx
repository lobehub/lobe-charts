import { AreaChart, AreaChartProps } from '@lobehub/charts';
import { useTheme } from 'antd-style';

const data: AreaChartProps['data'] = [
  {
    'Distance Running': 167,
    'Hatha Yoga': 115,
    'Open Water Swimming': 135,
    'Road Cycling': 145,
    'Street Basketball': 150,
    'date': 'Jan 23',
  },
  {
    'Distance Running': 125,
    'Hatha Yoga': 85,
    'Open Water Swimming': 155,
    'Road Cycling': 110,
    'Street Basketball': 180,
    'date': 'Feb 23',
  },
  {
    'Distance Running': 156,
    'Hatha Yoga': 90,
    'Open Water Swimming': 145,
    'Road Cycling': 149,
    'Street Basketball': 130,
    'date': 'Mar 23',
  },
  {
    'Distance Running': 165,
    'Hatha Yoga': 105,
    'Open Water Swimming': 125,
    'Road Cycling': 112,
    'Street Basketball': 170,
    'date': 'Apr 23',
  },
  {
    'Distance Running': 153,
    'Hatha Yoga': 100,
    'Open Water Swimming': 165,
    'Road Cycling': 138,
    'Street Basketball': 110,
    'date': 'May 23',
  },
  {
    'Distance Running': 124,
    'Hatha Yoga': 75,
    'Open Water Swimming': 175,
    'Road Cycling': 145,
    'Street Basketball': 140,
    'date': 'Jun 23',
  },
];

export default () => {
  const theme = useTheme();
  return (
    <AreaChart
      categories={['Distance Running', 'Road Cycling', 'Open Water Swimming']}
      colors={[theme.purple, theme.cyan, '#ffcc33']}
      data={data}
      index="date"
      yAxisWidth={30}
    />
  );
};
