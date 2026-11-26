import { BarChart } from '@lobehub/charts';
import { Flexbox, Segmented } from '@lobehub/ui';
import { useState } from 'react';

const data = [
  { '2025': 412_000, '2026': 538_000, 'region': 'NA' },
  { '2025': 298_000, '2026': 371_000, 'region': 'EMEA' },
  { '2025': 186_000, '2026': 262_000, 'region': 'APAC' },
  { '2025': 94_000, '2026': 131_000, 'region': 'LATAM' },
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
        <BarChart
          categories={['2025', '2026']}
          data={data}
          format="currency"
          index="region"
          subtitle="Quarterly, USD"
          title="Revenue by region"
          variant={variant}
        />
      </div>
    </Flexbox>
  );
};
