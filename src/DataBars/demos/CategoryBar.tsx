import { CategoryBar } from '@lobehub/charts';
import { useTheme } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const theme = useTheme();
  return (
    <Flexbox align={'center'} gap={24} width={'100%'}>
      <CategoryBar values={[50, 30, 20]} />
      <CategoryBar colors={[theme.gold, theme.geekblue]} values={[40, 30, 20, 10]} />
    </Flexbox>
  );
};
