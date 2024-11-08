import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  emphasis: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  label: css`
    font-size: 12px;
    line-height: 16px;
    color: ${token.colorTextDescription};
  `,
  strongLabel: css`
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    fill: ${token.colorTextSecondary};
  `,
}));
