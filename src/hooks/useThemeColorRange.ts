import { useTheme } from 'antd-style';
import { useMemo } from 'react';

export const useThemeColorRange = () => {
  const theme = useTheme();

  return useMemo(
    () => [
      theme.geekblue,
      theme.gold,
      theme.green,
      theme.cyan,
      theme.purple,
      theme.red,
      theme.volcano,
      theme.gray,
      theme.geekblue7,
      theme.gold7,
      theme.green7,
      theme.cyan7,
      theme.purple7,
      theme.red7,
      theme.volcano7,
      theme.gray7,
    ],
    [theme],
  );
};
