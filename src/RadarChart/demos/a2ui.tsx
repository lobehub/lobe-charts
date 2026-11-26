import { RadarChart } from '@lobehub/charts';
import { Flexbox, Segmented } from '@lobehub/ui';
import { useState } from 'react';

const data = [
  { 'axis': 'Reasoning', 'Model A': 92, 'Model B': 81 },
  { 'axis': 'Coding', 'Model A': 88, 'Model B': 79 },
  { 'axis': 'Math', 'Model A': 85, 'Model B': 72 },
  { 'axis': 'Tool use', 'Model A': 90, 'Model B': 84 },
  { 'axis': 'Long context', 'Model A': 78, 'Model B': 91 },
  { 'axis': 'Latency', 'Model A': 64, 'Model B': 88 },
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
        <RadarChart
          categories={['Model A', 'Model B']}
          data={data}
          index="axis"
          maxValue={100}
          subtitle="Score out of 100 per benchmark"
          title="Model eval profile"
          variant={variant}
        />
      </div>
    </Flexbox>
  );
};
