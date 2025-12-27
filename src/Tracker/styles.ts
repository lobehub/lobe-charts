import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  emphasis: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  label: css`
    font-size: 12px;
    line-height: 16px;
    color: ${cssVar.colorTextDescription};
  `,
  strongLabel: css`
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    fill: ${cssVar.colorTextSecondary};
  `,
}));
