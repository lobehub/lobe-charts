import { LocationCard } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { blueBottle } from './data';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      variant: { options: ['default', 'a2ui'], value: 'default' },
      address: blueBottle.address!,
      category: blueBottle.category!,
      hours: blueBottle.hours!,
      name: blueBottle.name,
      rating: { max: 5, min: 0, step: 0.1, value: 4.6 },
      showActions: true,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <LocationCard
        {...(props as any)}
        lat={blueBottle.lat}
        lon={blueBottle.lon}
        style={{ maxWidth: 560 }}
      />
    </StoryBook>
  );
};
