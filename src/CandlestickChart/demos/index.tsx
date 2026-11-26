import { CandlestickChart } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { prices } from './data';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      days: { max: 30, min: 2, step: 1, value: 30 },
      format: { options: ['number', 'compact', 'currency', 'percent'], value: 'currency' },
      height: 240,
      loading: false,
      showSummary: true,
      showTooltip: true,
      subtitle: 'Daily OHLC, September 2026',
      title: 'Halvorsen Robotics (HLVR)',
    },
    { store },
  );
  const { days, ...rest } = props as any;

  return (
    <StoryBook levaStore={store}>
      <CandlestickChart data={prices.slice(0, days)} {...rest} style={{ maxWidth: 662 }} />
    </StoryBook>
  );
};
