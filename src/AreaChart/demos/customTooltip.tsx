import { AreaChart, AreaChartProps, ChartTooltipFrame } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { Typography } from 'antd';
import { useTheme } from 'antd-style';

const data: AreaChartProps['data'] = [
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
];

export default () => {
  const theme = useTheme();

  const customTooltip: AreaChartProps['customTooltip'] = ({ payload, active }) => {
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
              <Typography.Paragraph ellipsis style={{ color: theme.colorTextSecondary, margin: 0 }}>
                {category.dataKey}
              </Typography.Paragraph>
              <Typography.Paragraph ellipsis style={{ margin: 0 }}>
                {category.value} bpm
              </Typography.Paragraph>
            </Flexbox>
          </Flexbox>
        ))}
      </ChartTooltipFrame>
    );
  };
  return (
    <Flexbox>
      <h4>Average BPM</h4>
      <AreaChart categories={['Running']} customTooltip={customTooltip} data={data} index="date" />
    </Flexbox>
  );
};
