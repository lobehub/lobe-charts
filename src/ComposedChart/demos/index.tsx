import { ComposedChart, ComposedChartProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { FC } from 'react';

const data: ComposedChartProps['data'] = [
  { bucket: '0–1k', ops: 1200, successRate: 84.2 },
  { bucket: '1k–2k', ops: 2850, successRate: 86.5 },
  { bucket: '2k–5k', ops: 5400, successRate: 88.1 },
  { bucket: '5k–10k', ops: 8730, successRate: 90.4 },
  { bucket: '10k–20k', ops: 13_250, successRate: 92.7 },
  { bucket: '20k–50k', ops: 19_860, successRate: 94.3 },
  { bucket: '50k+', ops: 32_000, successRate: 95.8 },
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
      yAxisRightCustomDomain: true,
    },
    { store },
  );

  const { yAxisRightCustomDomain, ...chartProps } = props;

  return (
    <StoryBook levaStore={store}>
      <ComposedChart
        data={data}
        index="bucket"
        series={[
          { axis: 'left', key: 'ops', name: 'Requests', type: 'bar' },
          { axis: 'right', key: 'successRate', name: 'Success Rate (%)', type: 'line' },
        ]}
        yAxisLeft={{ label: 'Requests', valueFormatter: (v) => v.toLocaleString() }}
        yAxisRight={{
          ...(yAxisRightCustomDomain
            ? { domain: [(dataMin: number) => Math.max(0, dataMin - 5), 100] }
            : {}),
          label: 'Success Rate (%)',
          valueFormatter: (v) => `${v.toFixed(1)}%`,
        }}
        {...chartProps}
      />
    </StoryBook>
  );
};

ComposedChartDemo.displayName = 'ComposedChartDemo';

export default ComposedChartDemo;
