import { Flexbox, FlexboxProps, createStaticStyles } from '@lobehub/ui';
import { memo } from 'react';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  container: css`
    overflow: hidden;

    width: max-content;
    min-width: 160px;
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
