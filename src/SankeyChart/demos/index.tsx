import { SankeyChart } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { funnel } from './data';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      format: { options: ['number', 'compact', 'currency', 'percent'], value: 'compact' },
      height: 280,
      loading: false,
      nodeWidth: 10,
      showTooltip: true,
      showValues: true,
      subtitle: 'Visitors to paid accounts, last quarter',
      title: 'Signup funnel',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <SankeyChart data={funnel} {...(props as any)} style={{ maxWidth: 662 }} />
    </StoryBook>
  );
};
