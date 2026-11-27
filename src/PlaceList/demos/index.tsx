import { PlaceList } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { ramen } from './data';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      variant: { options: ['default', 'a2ui'], value: 'default' },
      basemap: {
        options: ['auto', 'liberty', 'bright', 'positron', 'dark', 'fiord'],
        value: 'auto',
      },
      height: { max: 640, min: 200, step: 10, value: 340 },
      source: 'Sample data',
      title: 'Ramen near Shibuya',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <PlaceList {...(props as any)} places={ramen} style={{ maxWidth: 662 }} />
    </StoryBook>
  );
};
