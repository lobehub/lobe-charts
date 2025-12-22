import { ChartTooltipFrame, DonutChart, DonutChartProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { Typography } from 'antd';
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

const valueFormatter: DonutChartProps['valueFormatter'] = (number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export default () => {
  const theme = useTheme();

  const customTooltip: DonutChartProps['customTooltip'] = ({ payload, active }) => {
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
    <DonutChart
      category="sales"
      customTooltip={customTooltip}
      data={data}
      index="name"
      valueFormatter={valueFormatter}
    />
  );
};
