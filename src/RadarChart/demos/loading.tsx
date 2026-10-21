import { RadarChart } from '@lobehub/charts';

export default () => {
  return <RadarChart loading categories={['productA', 'productB']} data={[]} index="subject" />;
};
