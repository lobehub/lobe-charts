import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    overflow: hidden;

    background: ${token.colorBgElevated};
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
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
