import { ScatterChart } from '@lobehub/charts';
import { useTheme } from 'antd-style';

const chartdata = [
  {
    location: 'Location A',
    x: 100,
    y: 200,
    z: 200,
  },
  {
    location: 'Location A',
    x: 120,
    y: 100,
    z: 260,
  },
  {
    location: 'Location A',
    x: 170,
    y: 300,
    z: 400,
  },
  {
    location: 'Location B',
    x: 140,
    y: 250,
    z: 280,
  },
  {
    location: 'Location B',
    x: 150,
    y: 400,
    z: 500,
  },
  {
    location: 'Location B',
    x: 110,
    y: 280,
    z: 200,
  },
  {
    location: 'Location C',
    x: 200,
    y: 260,
    z: 240,
  },
  {
    location: 'Location C',
    x: 220,
    y: 290,
    z: 120,
  },
  {
    location: 'Location D',
    x: 0,
    y: 190,
    z: 250,
  },
  {
    location: 'Location D',
    x: 70,
    y: 0,
    z: 950,
  },
];

export default () => {
  const theme = useTheme();
  return (
    <ScatterChart
      category="location"
      colors={[theme.purple, theme.colorSuccess, theme.volcano, '#ffcc33']}
      data={chartdata}
      showLegend={false}
      size="z"
      x="x"
      y="y"
      yAxisWidth={50}
    />
  );
};
