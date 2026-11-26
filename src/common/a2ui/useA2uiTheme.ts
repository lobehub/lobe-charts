import { useThemeMode } from '@lobehub/ui';

import { styles } from './styles';

/** Class that defines the a2ui colour variables for the current light / dark mode. */
export const useA2uiThemeClass = () => {
  const { isDarkMode } = useThemeMode();
  return isDarkMode ? styles.dark : styles.light;
};
