import { FunnelChart, FunnelChartProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';

const data: FunnelChartProps['data'] = [
  { name: '1. Add credit Card', value: 89 },
  { name: '2. Copy invite code', value: 6 },
  {
    name: '3. Send invite code',
    value: 5,
  },
];

export default () => {
  const store = useCreateStore();

  const props: FunnelChartProps | any = useControls(
    {
      barGap: '20%',
      enableLegendSlider: false,
      evolutionGradient: true,
      gradient: false,
      showArrow: true,
      showGridLines: true,
      showLegend: true,
      showTooltip: true,
      showXAxis: true,
      showYAxis: true,
      variant: {
        options: ['base', 'center'],
        value: 'base',
      },
      xAxisLabel: '',
      yAxisAlign: {
        options: ['left', 'right'],
        value: 'left',
      },
      yAxisLabel: '',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <FunnelChart data={data} {...props} />
    </StoryBook>
  );
};
