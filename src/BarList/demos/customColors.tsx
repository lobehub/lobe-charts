import type { BarListProps } from '@lobehub/charts';
import { BarList } from '@lobehub/charts';
import { useTheme } from '@lobehub/ui';

export default () => {
  const theme = useTheme();

  const data: BarListProps['data'] = [
    { name: '/home', value: 456 },
    { color: theme.magenta, name: '/imprint', value: 351 },
    { name: '/cancellation', value: 51 },
  ];

  return <BarList color={theme.gold} data={data} />;
};
