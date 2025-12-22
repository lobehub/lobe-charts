import { Heatmaps } from '@lobehub/charts';
import { Flexbox, Highlighter } from '@lobehub/ui';
import { useState } from 'react';

import { yearData } from './data';

export default () => {
  const [value, setValue] = useState({});
  return (
    <Flexbox gap={16}>
      <Heatmaps data={yearData} onValueChange={(v) => setValue(v)} />
      <Highlighter language={'json'} style={{ marginTop: 16 }}>
        {JSON.stringify(value, null, 2)}
      </Highlighter>
    </Flexbox>
  );
};
