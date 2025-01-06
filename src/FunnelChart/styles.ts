import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  chart: css`
    outline: none;
  `,
  emphasis: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  gridLines: css`
    stroke: ${token.colorBorderSecondary};
    stroke-width: 1;
  `,
  label: css`
    font-size: 12px;
    line-height: 16px;
    fill: ${token.colorTextDescription};
  `,
  strongLabel: css`
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    fill: ${token.colorTextSecondary};
  `,
}));
