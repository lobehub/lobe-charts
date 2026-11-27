import { MapView } from '@lobehub/charts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { lisbon } from './data';

export default () => {
  const store = useCreateStore();
  const props = useControls(
    {
      variant: { options: ['default', 'a2ui'], value: 'default' },
      basemap: {
        options: ['auto', 'liberty', 'bright', 'positron', 'dark', 'fiord'],
        value: 'auto',
      },
      height: { max: 640, min: 160, step: 10, value: 340 },
      showChips: true,
      title: 'Weekend in Lisbon',
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <MapView {...(props as any)} markers={lisbon} style={{ maxWidth: 662 }} />
    </StoryBook>
  );
};
