import { BarChart, BarChartProps, ChartTooltipFrame } from '@lobehub/charts';
import { Flexbox, Text, useTheme } from '@lobehub/ui';

const data: BarChartProps['data'] = [
  {
    Running: 167,
    date: 'Jan 23',
  },
  {
    Running: 125,
    date: 'Feb 23',
  },
  {
    Running: 156,
    date: 'Mar 23',
  },
  {
    Running: 165,
    date: 'Apr 23',
  },
  {
    Running: 153,
    date: 'May 23',
  },
  {
    Running: 124,
    date: 'Jun 23',
  },
  {
    Running: 164,
    date: 'Jul 23',
  },
  {
    Running: 123,
    date: 'Aug 23',
  },
  {
    Running: 132,
    date: 'Sep 23',
  },
];

export default () => {
  const theme = useTheme();

  const customTooltip: BarChartProps['customTooltip'] = ({ payload, active }) => {
    if (!active || !payload) return null;
    return (
      <ChartTooltipFrame gap={4} padding={8}>
        {payload.map((category: any, idx: number) => (
          <Flexbox gap={8} horizontal key={idx} style={{ position: 'relative' }}>
            <Flexbox
              flex={'none'}
              style={{ background: category.color, borderRadius: 2, minHeight: '100%' }}
              width={4}
            />
            <Flexbox>
              <Text ellipsis style={{ color: theme.colorTextSecondary, margin: 0 }}>
                {category.dataKey}
              </Text>
              <Text ellipsis style={{ margin: 0 }}>
                {category.value} bpm
              </Text>
            </Flexbox>
          </Flexbox>
        ))}
      </ChartTooltipFrame>
    );
  };

  return (
    <Flexbox>
      <h4>Average BPM</h4>
      <BarChart
        categories={['Running']}
        customTooltip={customTooltip}
        data={data}
        index="date"
        yAxisWidth={36}
      />
    </Flexbox>
  );
};
