import { PlaceList } from '@lobehub/charts';

import { ramen } from './data';

export default () => (
  <PlaceList places={ramen.slice(0, 3)} style={{ maxWidth: 380 }} title="Ramen near Shibuya" />
);
