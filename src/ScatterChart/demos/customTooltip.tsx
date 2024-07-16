import { ChartTooltipFrame, ScatterChart } from '@lobehub/charts';
import { Typography } from 'antd';
import { useTheme } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

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

type CustomTooltipTypeBar = {
  active: boolean | undefined;
  label: any;
  payload: any;
};

export default () => {
  const theme = useTheme();

  const customTooltip = ({ payload, active, label }: CustomTooltipTypeBar) => {
    if (!active || !payload) return null;
    return (
      <ChartTooltipFrame gap={8} padding={8}>
        <Flexbox gap={16} horizontal style={{ position: 'relative' }}>
          <Flexbox
            flex={'none'}
            style={{ background: payload[0].color, borderRadius: 2, minHeight: '100%' }}
            width={4}
          />
          <Flexbox gap={8}>
            <Typography.Paragraph style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
              {label}
            </Typography.Paragraph>
            <Flexbox>
              {payload.map((payloadItem: any, idx: number) => (
                <Flexbox gap={48} horizontal key={idx}>
                  <Typography.Paragraph
                    ellipsis
                    style={{ color: theme.colorTextSecondary, margin: 0 }}
                  >
                    {payloadItem.dataKey}
                  </Typography.Paragraph>
                  <Typography.Paragraph ellipsis style={{ margin: 0 }}>
                    {payloadItem.value}
                  </Typography.Paragraph>
                </Flexbox>
              ))}
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </ChartTooltipFrame>
    );
  };

  return (
    <ScatterChart
      category="location"
      customTooltip={customTooltip}
      data={chartdata}
      showLegend={false}
      size="z"
      x="x"
      y="y"
      yAxisWidth={50}
    />
  );
};
