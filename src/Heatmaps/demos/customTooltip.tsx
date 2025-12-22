import { Heatmaps, HeatmapsProps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { Typography } from 'antd';
import { useTheme } from 'antd-style';

import { yearData } from './data';

export default () => {
  const theme = useTheme();

  const customTooltip: HeatmapsProps['customTooltip'] = (payload) => {
    if (!payload) return null;
    return (
      <Flexbox gap={8} horizontal style={{ position: 'relative' }}>
        <Flexbox
          flex={'none'}
          style={{ background: theme.colorSuccess, borderRadius: 2, minHeight: '100%' }}
          width={4}
        />
        <Flexbox>
          <Typography.Paragraph
            ellipsis
            style={{ color: theme.colorBgLayout, margin: 0, opacity: 0.5 }}
          >
            {payload.date}
          </Typography.Paragraph>
          <Typography.Paragraph ellipsis style={{ color: theme.colorBgLayout, margin: 0 }}>
            {payload.count}
          </Typography.Paragraph>
        </Flexbox>
      </Flexbox>
    );
  };

  return <Heatmaps customTooltip={customTooltip} data={yearData} />;
};
