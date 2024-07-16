import { ChartTooltipFrame, DonutChart } from '@lobehub/charts';
import { Typography } from 'antd';
import { useTheme } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

const sales = [
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

const valueFormatter = (number: number) => `$ ${Intl.NumberFormat('us').format(number).toString()}`;

type CustomTooltipTypeBar = {
  active: boolean | undefined;
  label: any;
  payload: any;
};

export default () => {
  const theme = useTheme();

  const customTooltip = (props: CustomTooltipTypeBar) => {
    const { payload, active } = props;
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
      data={sales}
      index="name"
      valueFormatter={valueFormatter}
    />
  );
};
