import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ prefixCls, css, token }) => ({
  bar: css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    max-width: 100%;
    height: 100%;
    border-radius: ${token.borderRadius}px;

    opacity: 0.25;

    transition: all 0.25s ${token.motionEaseInOut};
  `,
  barContainer: css`
    position: relative;
  `,
  barHover: css`
    &:hover {
      .${prefixCls}-chart-bar-item {
        opacity: 0.4;
      }
    }
  `,
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
  sourceALabel: css`
    font-size: 14px;
    line-height: 16px;
    color: ${token.colorText} !important;

    &:hover {
      color: ${token.colorLinkHover} !important;
    }
  `,
  sourceLabel: css`
    font-size: 14px;
    line-height: 16px;
    color: ${token.colorText};
  `,
  strongLabel: css`
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    color: ${token.colorText};
  `,
}));
