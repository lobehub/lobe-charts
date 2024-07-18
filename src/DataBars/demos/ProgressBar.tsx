import { ProgressBar } from '@lobehub/charts';
import { useTheme } from 'antd-style';

export default () => {
  const theme = useTheme();
  return <ProgressBar color={theme.geekblue} tooltip={'72%'} value={72} />;
};
