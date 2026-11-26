import { TreemapChart } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { spend } from './data';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      variant: { options: ['default', 'a2ui'], value: 'default' },
      format: { options: ['number', 'compact', 'currency', 'percent'], value: 'currency' },
      height: 260,
      loading: false,
      showLegend: true,
      showTooltip: true,
      subtitle: 'Last 30 days, USD',
      title: 'Cloud spend by service',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <TreemapChart data={spend} {...(props as any)} style={{ maxWidth: 662 }} />
    </StoryBook>
  );
};
