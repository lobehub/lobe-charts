import { HeatmapChart } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { requests } from './data';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      variant: { options: ['default', 'a2ui'], value: 'default' },
      format: { options: ['number', 'compact', 'currency', 'percent'], value: 'compact' },
      loading: false,
      showLegend: true,
      showTooltip: true,
      showValues: false,
      subtitle: 'Average per 3h window, last 4 weeks (UTC)',
      title: 'API requests by hour',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <HeatmapChart
        data={requests}
        value="requests"
        x="hour"
        y="day"
        {...(props as any)}
        style={{ maxWidth: 662 }}
      />
    </StoryBook>
  );
};
