import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  emphasis: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  gridLines: css`
    stroke: ${cssVar.colorBorderSecondary};
    stroke-width: 1;
  `,
  label: css`
    font-size: 12px;
    line-height: 16px;
    fill: ${cssVar.colorTextDescription};
  `,
  strongLabel: css`
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    fill: ${cssVar.colorTextSecondary};
  `,
}));
