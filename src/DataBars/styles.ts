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
    fill: ${cssVar.colorTextDescription};
  `,
  marker: css`
    width: 4px;
    border-radius: 4px;
    box-shadow: 0 0 0 3px ${cssVar.colorBgContainer};
  `,
  markerWrapper: css`
    position: absolute;
    right: 50%;
    width: 1.25rem;
  `,
  showAnimation: css`
    transition: all 0.25s ${cssVar.motionEaseInOut};
  `,
}));
