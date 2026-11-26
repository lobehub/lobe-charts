import { GaugeChart } from '@lobehub/charts';
import { Flexbox, Segmented } from '@lobehub/ui';
import { useState } from 'react';

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
      <div style={{ width: 178 }}>
        <GaugeChart
          format="percent"
          label="of 512 GPUs busy"
          max={100}
          min={0}
          title="GPU cluster utilization"
          value={72}
          variant={variant}
        />
      </div>
    </Flexbox>
  );
};
