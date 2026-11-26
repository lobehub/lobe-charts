import { DonutChart } from '@lobehub/charts';
import { Flexbox, Segmented } from '@lobehub/ui';
import { useState } from 'react';

const data = [
  { name: 'Organic search', value: 48_200 },
  { name: 'Direct', value: 27_100 },
  { name: 'Referral', value: 14_600 },
  { name: 'Social', value: 9800 },
  { name: 'Email', value: 5300 },
];

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
      <div style={{ maxWidth: 560 }}>
        <DonutChart
          centerLabel="sessions"
          data={data}
          format="compact"
          subtitle="Sessions, last 30 days"
          title="Traffic sources"
          variant={variant === 'a2ui' ? 'a2ui' : 'donut'}
        />
      </div>
    </Flexbox>
  );
};
