import { Flexbox, FlexboxProps } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo } from 'react';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    overflow: hidden;

    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;

    background: ${token.colorBgElevated};
    box-shadow: ${token.boxShadow};
  `,
}));

export const ChartTooltipFrame = memo<FlexboxProps>(({ children, ...rest }) => {
  const { styles } = useStyles();
  return (
    <Flexbox className={styles.container} {...rest}>
      {children}
    </Flexbox>
  );
});

export default ChartTooltipFrame;
