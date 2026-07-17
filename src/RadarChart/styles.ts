import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  gridLines: css`
    fill: none;
    stroke: ${cssVar.colorBorderSecondary};
    stroke-width: 1;
  `,
  label: css`
    font-size: 12px;
    line-height: 16px;
    fill: ${cssVar.colorTextDescription};
  `,
  radiusLabel: css`
    font-size: 12px;
    line-height: 16px;
    fill: ${cssVar.colorTextQuaternary};
  `,
}));
