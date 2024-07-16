import { useTheme } from 'antd-style';

export const useThemeColorRange = () => {
  const theme = useTheme();

  return [
    theme.geekblue,
    theme.gold,
    theme.lime,
    theme.volcano,
    theme.purple,

    theme.blue,
    theme.orange,
    theme.green,
    theme.red,
    theme.cyan,
    theme.yellow,
    theme.magenta,
  ];
};
