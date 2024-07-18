import { MarkerBar } from '@lobehub/charts';
import { useTheme } from 'antd-style';

export default () => {
  const theme = useTheme();
  return (
    <MarkerBar
      color={theme.geekblue}
      markerTooltip={'64%'}
      maxValue={90}
      minValue={10}
      rangeTooltip={'10-90%'}
      value={64}
    />
  );
};
