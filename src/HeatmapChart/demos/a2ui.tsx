import { HeatmapChart } from '@lobehub/charts';
import { Flexbox, Segmented } from '@lobehub/ui';
import { useState } from 'react';

import { requests } from './data';

export default () => {
  const [variant, setVariant] = useState<'a2ui' | 'default'>('a2ui');
  return (
    <Flexbox gap={12} width={'100%'}>
      <Segmented
        style={{ alignSelf: 'flex-start' }}
        value={variant}
        options={[
          { label: 'A2UI', value: 'a2ui' },
          { label: 'Default', value: 'default' },
        ]}
        onChange={(v) => setVariant(v as 'a2ui' | 'default')}
      />
      <div style={{ maxWidth: 662 }}>
        <HeatmapChart
          data={requests}
          format="compact"
          subtitle="Average per 3h window, last 4 weeks (UTC)"
          title="API requests by hour"
          value="requests"
          variant={variant}
          x="hour"
          y="day"
        />
      </div>
    </Flexbox>
  );
};
