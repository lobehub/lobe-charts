import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  accuracyText: css`
    font-size: 11px;
    font-weight: 500;

    dominant-baseline: central;
    text-anchor: middle;
    fill: ${token.colorText};
  `,
  accuracyTextLight: css`
    font-size: 11px;
    font-weight: 500;

    dominant-baseline: central;
    text-anchor: middle;
    fill: ${token.colorTextLightSolid};
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
    fill: ${token.colorTextSecondary};
  `,
}));
