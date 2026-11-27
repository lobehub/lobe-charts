import { CARTO_STYLES, MapView } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';

import { lisbon } from './data';

export default () => (
  <Flexbox gap={16} width={'100%'}>
    <MapView basemap="positron" height={240} markers={lisbon} title="OpenFreeMap Positron" />
    <MapView
      height={240}
      mapStyle={{ dark: CARTO_STYLES.darkMatter, light: CARTO_STYLES.voyager }}
      markers={lisbon}
      title="CARTO fallback"
    />
  </Flexbox>
);
