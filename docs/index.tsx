import { createStyles } from 'antd-style';
import { Center } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    margin-top: -4%;
  `,
}));

export default () => {
  const { styles } = useStyles();

  return (
    <Center className={styles.container} gap={16}>
      1111
    </Center>
  );
};
