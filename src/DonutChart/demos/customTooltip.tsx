import { ChartTooltipFrame, DonutChart, DonutChartProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { Text } from '@lobehub/ui/base-ui';
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
    <DonutChart
      category="sales"
      customTooltip={customTooltip}
      data={data}
      index="name"
      valueFormatter={valueFormatter}
    />
  );
};
