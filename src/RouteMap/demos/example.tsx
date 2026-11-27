import { RouteMap } from '@lobehub/charts';

import { cycling } from './data';

export default () => <RouteMap {...cycling} style={{ maxWidth: 560 }} />;
