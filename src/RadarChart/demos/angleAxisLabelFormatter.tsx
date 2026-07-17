import { RadarChart, RadarChartProps, useThemeColorRange } from '@lobehub/charts';

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

export default () => {
  const colors = useThemeColorRange();
  const colorA = colors[0];

  return (
    <RadarChart
      angleAxisLabelFormatter={(label, payload) => (
        <>
          {label} <tspan fill={colorA}>{payload?.productA}</tspan>
        </>
      )}
      categories={['productA', 'productB']}
      customCategories={{
        productA: 'Product A',
        productB: 'Product B',
      }}
      data={data}
      index="subject"
    />
  );
};
