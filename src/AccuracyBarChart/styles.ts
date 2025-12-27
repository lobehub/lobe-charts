import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  accuracyText: css`
    font-size: 11px;
    font-weight: 500;

    dominant-baseline: central;
    text-anchor: middle;
    fill: ${cssVar.colorText};
  `,
  accuracyTextLight: css`
    font-size: 11px;
    font-weight: 500;

    dominant-baseline: central;
    text-anchor: middle;
    fill: ${cssVar.colorTextLightSolid};
  `,
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
  leftValue: css`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;

    padding-right: 8px;
  `,
  leftValueContainer: css`
    pointer-events: none;

    position: absolute;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;

    display: flex;
    flex-direction: column;

    width: 80px;
  `,
  percentageLabel: css`
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
  `,
  strongLabel: css`
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    fill: ${cssVar.colorTextSecondary};
  `,
}));
