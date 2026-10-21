import type { HeatmapsProps } from '@lobehub/charts';
import { Heatmaps } from '@lobehub/charts';
import { cssVar, Flexbox, Text } from '@lobehub/ui';

import { yearData } from './data';

export default () => {
  const customTooltip: HeatmapsProps['customTooltip'] = (payload) => {
    if (!payload) return null;
    return (
      <Flexbox horizontal gap={8} style={{ position: 'relative' }}>
        <Flexbox
          flex={'none'}
          style={{ background: cssVar.colorSuccess, borderRadius: 2, minHeight: '100%' }}
          width={4}
        />
        <Flexbox>
          <Text ellipsis style={{ color: cssVar.colorBgLayout, margin: 0, opacity: 0.5 }}>
            {payload.date}
          </Text>
          <Text ellipsis style={{ color: cssVar.colorBgLayout, margin: 0 }}>
            {payload.count}
          </Text>
        </Flexbox>
      </Flexbox>
    );
  };

  return <Heatmaps customTooltip={customTooltip} data={yearData} />;
};
