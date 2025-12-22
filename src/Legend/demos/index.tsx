import { CategoryBar, Legend } from '@lobehub/charts';
import { Flexbox } from '@lobehub/ui';
import { useTheme } from 'antd-style';

export default () => {
  const theme = useTheme();
  const colors = [theme.colorSuccess, theme.colorError];
  return (
    <Flexbox gap={8} width={'100%'}>
      <div style={{ color: theme.colorTextSecondary }}>Total Users</div>
      <h2 style={{ marginBlock: 0 }}>10,483</h2>
      <div />
      <CategoryBar colors={colors} values={[6724, 3621]} />
      <Legend categories={['Active users', 'Inactive users']} colors={colors} />
    </Flexbox>
  );
};
