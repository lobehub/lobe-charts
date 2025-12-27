import { Flexbox, FlexboxProps } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { memo } from 'react';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  container: css`
    overflow: hidden;

    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    background: ${cssVar.colorBgElevated};
    box-shadow: ${cssVar.boxShadow};
  `,
}));

export const ChartTooltipFrame = memo<FlexboxProps>(({ children, ...rest }) => {
  return (
    <Flexbox className={styles.container} {...rest}>
      {children}
    </Flexbox>
  );
});

export default ChartTooltipFrame;
