import { PlaceList } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { useState } from 'react';

import { ramen } from './data';

export default () => {
  const [picked, setPicked] = useState('Afuri Ebisu');
  return (
    <Flexbox gap={8} width={'100%'}>
      <PlaceList
        places={ramen}
        selected={1}
        style={{ maxWidth: 662 }}
        title="Ramen near Shibuya"
        onSelectedChange={(_, place) => setPicked(place?.name ?? 'none')}
      />
      <div style={{ fontSize: 12 }}>Selected: {picked}</div>
    </Flexbox>
  );
};
