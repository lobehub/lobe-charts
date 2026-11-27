import { PlaceList } from '@lobehub/charts';

import { ramen } from './data';

export default () => (
  <PlaceList
    places={ramen}
    source="Sample data"
    style={{ maxWidth: 662 }}
    title="Ramen near Shibuya"
  />
);
