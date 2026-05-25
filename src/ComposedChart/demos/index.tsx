import { ComposedChart, ComposedChartProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { FC } from 'react';

const data: ComposedChartProps['data'] = [
  { bucket: '0–1k', cost: 12.4, ops: 1200 },
  { bucket: '1k–2k', cost: 28.7, ops: 2850 },
  { bucket: '2k–5k', cost: 54.1, ops: 5400 },
  { bucket: '5k–10k', cost: 87.3, ops: 8730 },
  { bucket: '10k–20k', cost: 132.5, ops: 13_250 },
  { bucket: '20k–50k', cost: 198.6, ops: 19_860 },
  { bucket: '50k+', cost: 320, ops: 32_000 },
];

const ComposedChartDemo: FC = () => {
  const store = useCreateStore();

  const props: ComposedChartProps | any = useControls(
    {
      allowDecimals: true,
      animationDuration: {
        step: 1,
        value: 900,
      },
      enableLegendSlider: false,
      intervalType: {
        options: ['preserveStartEnd', 'equidistantPreserveStart'],
        value: 'equidistantPreserveStart',
      },
      showAnimation: false,
      showGridLines: true,
      showLegend: true,
      showTooltip: true,
      showXAxis: true,
      showYAxis: true,
      startEndOnly: false,
      tickGap: {
        step: 1,
        value: 5,
      },
      xAxisLabel: '',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <ComposedChart
        data={data}
        index="bucket"
        series={[
          { axis: 'left', key: 'ops', name: 'Requests', type: 'bar' },
          { axis: 'right', key: 'cost', name: 'Cost (USD)', type: 'line' },
        ]}
        yAxisLeft={{ label: 'Requests', valueFormatter: (v) => v.toLocaleString() }}
        yAxisRight={{ label: 'Cost (USD)', valueFormatter: (v) => `$${v.toFixed(2)}` }}
        {...props}
      />
    </StoryBook>
  );
};

ComposedChartDemo.displayName = 'ComposedChartDemo';

export default ComposedChartDemo;
