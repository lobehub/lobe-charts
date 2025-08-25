import { AccuracyBarChart, AccuracyBarChartProps } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { FC } from 'react';

const data: AccuracyBarChartProps['data'] = [
  {
    accuracy: 52,
    error: 1,
    name: 'Warp',
  },
  {
    accuracy: 49,
    error: 1.1,
    name: 'GPT-5',
  },
  {
    accuracy: 44.8,
    error: 0.8,
    name: 'Engine Labs',
  },
  {
    accuracy: 43.8,
    error: 1.4,
    name: 'Terminus 2',
  },
  {
    accuracy: 43.2,
    error: 1.3,
    name: 'Claude Code',
  },
  {
    accuracy: 25.3,
    error: 2.1,
    name: 'Terminus 1',
  },
];

const AccuracyBarChartDemo: FC = () => {
  const store = useCreateStore();

  const props: AccuracyBarChartProps | any = useControls(
    {
      animationDuration: {
        step: 1,
        value: 900,
      },
      autoMinValue: true,
      barCategoryGap: '20%',
      layout: {
        options: ['horizontal', 'vertical'],
        value: 'vertical',
      },
      maxValue: 100,
      minValue: 0,
      showAnimation: false,
      showErrorBars: true,
      showGridLines: true,
      showLeftValue: true,
      showLegend: false,
      showPercentage: true,
      showTooltip: true,
      showXAxis: true,
      showYAxis: true,
      xAxisLabel: 'Accuracy (%)',
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
      <AccuracyBarChart
        category={'accuracy'}
        colors={['#fff']}
        data={data}
        errorKey={'error'}
        index={'name'}
        onValueChange={(v: any) => console.log(v)}
        {...props}
      />
    </StoryBook>
  );
};

AccuracyBarChartDemo.displayName = 'AccuracyBarChartDemo';

export default AccuracyBarChartDemo;
