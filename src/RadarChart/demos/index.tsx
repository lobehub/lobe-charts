import { RadarChart, RadarChartProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { FC } from 'react';

const data: RadarChartProps['data'] = [
  {
    productA: 120,
    productB: 110,
    subject: 'Sales',
  },
  {
    productA: 98,
    productB: 130,
    subject: 'Marketing',
  },
  {
    productA: 86,
    productB: 130,
    subject: 'Development',
  },
  {
    productA: 99,
    productB: 100,
    subject: 'Customer Support',
  },
  {
    productA: 85,
    productB: 90,
    subject: 'Information Technology',
  },
  {
    productA: 65,
    productB: 85,
    subject: 'Administration',
  },
];

const valueFormatter: RadarChartProps['valueFormatter'] = (number) =>
  Intl.NumberFormat('us').format(number).toString();

const RadarChartDemo: FC = () => {
  const store = useCreateStore();

  const props: RadarChartProps | any = useControls(
    {
      allowDecimals: true,
      animationDuration: {
        step: 1,
        value: 900,
      },
      autoMinValue: false,
      dimSecondarySeries: true,
      enableLegendSlider: false,
      fillOpacity: {
        max: 1,
        min: 0,
        step: 0.01,
        value: 0.33,
      },
      maxValue: 150,
      minValue: 0,
      secondaryOpacity: {
        max: 1,
        min: 0,
        step: 0.05,
        value: 0.25,
      },
      shape: {
        options: ['polygon', 'circle'],
        value: 'polygon',
      },
      showAnimation: false,
      showGridLines: true,
      showLegend: true,
      showRadiusAxis: false,
      showTooltip: true,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <RadarChart
        categories={['productA', 'productB']}
        customCategories={{
          productA: 'Product A',
          productB: 'Product B',
        }}
        data={data}
        index="subject"
        onValueChange={(v) => console.log(v)}
        valueFormatter={valueFormatter}
        {...props}
      />
    </StoryBook>
  );
};

RadarChartDemo.displayName = 'RadarChartDemo';

export default RadarChartDemo;
