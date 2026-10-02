import { Heatmaps, HeatmapsProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { Text } from '@lobehub/ui/base-ui';
import { cssVar } from 'antd-style';

import { yearData } from './data';

export default () => {
  const customTooltip: HeatmapsProps['customTooltip'] = (payload) => {
    if (!payload) return null;
    return (
      <Flexbox gap={8} horizontal style={{ position: 'relative' }}>
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
