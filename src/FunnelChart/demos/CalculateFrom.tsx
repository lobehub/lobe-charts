import { FunnelChart, FunnelChartProps } from '@lobehub/charts';

const data: FunnelChartProps['data'] = [
  { name: 'Session start', value: 31_943 },
  { name: 'Account Created', value: 10_474 },
  {
    name: 'Item Detail Page',
    value: 9482,
  },
  {
    name: 'Added to cart',
    value: 4684,
  },
  {
    name: 'Complete Purchase',
    value: 1283,
  },
];

export default () => {
  return (
    <FunnelChart
      calculateFrom={'previous'}
      data={data}
      evolutionGradient={false}
      gradient={true}
      showArrow={false}
    />
  );
};
