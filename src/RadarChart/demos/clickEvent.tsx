import type { RadarChartProps } from '@lobehub/charts';
import { RadarChart } from '@lobehub/charts';

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
  return (
    <RadarChart
      categories={['productA', 'productB']}
      data={data}
      index="subject"
      customCategories={{
        productA: 'Product A',
        productB: 'Product B',
      }}
      onValueChange={(v) => console.info(v)}
    />
  );
};
