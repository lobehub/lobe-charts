import { StockTicker } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { kestrel } from './data';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      variant: { options: ['default', 'a2ui'], value: 'default' },
      change: 3.21,
      changePct: 1.79,
      currency: 'USD',
      name: 'Kestrel Robotics Inc.',
      price: 182.47,
      sample: true,
      symbol: 'HLVR',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <StockTicker
        {...(props as any)}
        series={kestrel.series}
        stats={kestrel.stats}
        style={{ maxWidth: 560 }}
      />
    </StoryBook>
  );
};
