import { RadarChart, RadarChartProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

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

export default () => {
  return (
    <Flexbox>
      <h4>Department performance comparison</h4>
      <RadarChart
        categories={['productA', 'productB']}
        customCategories={{
          productA: 'Product A',
          productB: 'Product B',
        }}
        data={data}
        index="subject"
        valueFormatter={valueFormatter}
      />
    </Flexbox>
  );
};
