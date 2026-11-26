import { GaugeChart } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      format: { options: ['number', 'compact', 'currency', 'percent'], value: 'percent' },
      label: 'of 512 GPUs busy',
      max: 100,
      min: 0,
      title: 'GPU cluster utilization',
      value: { max: 100, min: 0, step: 1, value: 72 },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <GaugeChart {...(props as any)} style={{ width: 240 }} />
    </StoryBook>
  );
};
