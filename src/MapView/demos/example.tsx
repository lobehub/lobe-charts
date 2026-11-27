import { MapView } from '@lobehub/charts';

import { lisbon } from './data';

export default () => <MapView height={340} markers={lisbon} title="Weekend in Lisbon" />;
