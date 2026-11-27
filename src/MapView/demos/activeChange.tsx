import { MapView } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { useState } from 'react';

import { lisbon } from './data';

export default () => {
  const [active, setActive] = useState<string>('none');
  return (
    <Flexbox gap={8} width={'100%'}>
      <MapView
        height={280}
        markers={lisbon}
        title="Weekend in Lisbon"
        onActiveChange={(_, marker) => setActive(marker?.name ?? 'none')}
      />
      <div style={{ fontSize: 12 }}>Active: {active}</div>
    </Flexbox>
  );
};
