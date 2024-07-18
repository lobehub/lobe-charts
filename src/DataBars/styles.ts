import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  emphasis: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  label: css`
    font-size: 14px;
    line-height: 16px;
    fill: ${token.colorTextDescription};
  `,
  marker: css`
    width: 4px;
    border-radius: 4px;
    box-shadow: 0 0 0 3px ${token.colorBgContainer};
  `,
  markerWrapper: css`
    position: absolute;
    right: 50%;
    width: 1.25rem;
  `,
  showAnimation: css`
    transition: all 0.25s ${token.motionEaseInOut};
  `,
}));
