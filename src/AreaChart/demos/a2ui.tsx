import { AreaChart } from '@lobehub/charts';
import { Flexbox, Segmented } from '@lobehub/ui';
import { useState } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const chat = [4200, 4800, 5600, 6100, 7300, 8100, 8900, 9400, 10_800, 11_600, 12_900, 14_100];
const agents = [2100, 2600, 3300, 3900, 4400, 5200, 6100, 6900, 7400, 8300, 9100, 9800];
const embeddings = [900, 950, 1100, 1180, 1260, 1400, 1520, 1610, 1700, 1820, 1950, 2080];

const data = months.map((month, i) => ({
  Agents: agents[i],
  Chat: chat[i],
  Embeddings: embeddings[i],
  month,
}));

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
        <AreaChart
          stack
          categories={['Chat', 'Agents', 'Embeddings']}
          data={data}
          format="currency"
          index="month"
          subtitle="Stacked monthly cost, USD"
          title="Inference spend by workload"
          variant={variant}
        />
      </div>
    </Flexbox>
  );
};
