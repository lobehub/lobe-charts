import { createStaticStyles } from 'antd-style';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  bar: css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    max-width: 100%;
    height: 100%;
    border-radius: ${cssVar.borderRadius};

    opacity: 0.25;

    transition: all 0.25s ${cssVar.motionEaseInOut};
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
    color: ${cssVar.colorTextDescription};
  `,
  sourceALabel: css`
    font-size: 14px;
    line-height: 16px;
    color: ${cssVar.colorText} !important;

    &:hover {
      color: ${cssVar.colorLinkHover} !important;
    }
  `,
  sourceLabel: css`
    font-size: 14px;
    line-height: 16px;
    color: ${cssVar.colorText};
  `,
  strongLabel: css`
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    color: ${cssVar.colorText};
  `,
}));
