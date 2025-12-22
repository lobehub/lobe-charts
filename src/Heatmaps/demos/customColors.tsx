import { Heatmaps } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { useTheme } from 'antd-style';

import { yearData } from './data';

export default () => {
  const theme = useTheme();

  return (
    <Flexbox gap={24}>
      <Heatmaps
        colors={[
          theme.colorFillSecondary,
          theme.geekblue4,
          theme.geekblue6,
          theme.geekblue8,
          theme.geekblue10,
        ]}
        data={yearData}
      />
      <Heatmaps colors={[theme.gold, theme.geekblue]} data={yearData} />
    </Flexbox>
  );
};
