import { RouteMap } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { cycling } from './data';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      variant: { options: ['default', 'a2ui'], value: 'default' },
      basemap: {
        options: ['auto', 'liberty', 'bright', 'positron', 'dark', 'fiord'],
        value: 'auto',
      },
      distance: '8.4 km',
      duration: '32 min',
      from: 'Golden Gate Park',
      height: { max: 640, min: 160, step: 10, value: 300 },
      title: 'Cycling route',
      to: 'Ferry Building',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <RouteMap {...(props as any)} coordinates={cycling.coordinates} style={{ maxWidth: 560 }} />
    </StoryBook>
  );
};
