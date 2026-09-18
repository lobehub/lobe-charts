import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  chartHeader: css`
    pointer-events: none;

    position: absolute;
    z-index: 2;
    top: 8px;
    right: 0;
    left: 0;

    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    padding-inline: var(--benchmark-header-pad-inline, 48px);
  `,
  container: css`
    overflow: auto visible;

    .recharts-wrapper,
    .recharts-surface {
      overflow: visible;
    }

    /* stylelint-disable-next-line selector-class-pattern -- recharts internal class */
    .recharts-errorBar {
      mix-blend-mode: difference;
    }
  `,
  gridLines: css`
    stroke: ${cssVar.colorBorderSecondary};
    stroke-dasharray: 4 4;
    stroke-width: 1;
  `,
  iconWrap: css`
    overflow: visible;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
  `,
  label: css`
    font-size: 12px;
    line-height: 16px;
    fill: ${cssVar.colorTextDescription};
  `,
  legend: css`
    display: flex;
    flex-flow: column nowrap;
    gap: 6px;
    align-items: flex-start;

    min-width: 0;

    font-size: 12px;
    line-height: 16px;
    color: ${cssVar.colorTextSecondary};
  `,
  legendBars: css`
    display: inline-block;
    width: 14px;
    height: 10px;
    border-radius: 2px;
  `,
  legendItem: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;
  `,
  legendLine: css`
    display: inline-block;
    width: 16px;
    height: 0;
    border-top: 2px solid ${cssVar.colorTextSecondary};
  `,
  lineLabel: css`
    pointer-events: none;
    font-family: 'Geist Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace;
    font-weight: 500;
  `,
  rank: css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    font-family: 'Geist Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace;
    font-size: 14px;
    font-variant-numeric: tabular-nums;
    line-height: 1.3;
    color: ${cssVar.colorTextQuaternary};
    text-align: left;

    fill: ${cssVar.colorTextQuaternary};
  `,
  tickLabel: css`
    font-size: var(--benchmark-label-font-size, 11px);
    line-height: 1.25;
    fill: ${cssVar.colorTextSecondary};
  `,
  unrankedLabel: css`
    flex-shrink: 0;

    max-width: 42%;

    font-size: 12px;
    line-height: 16px;
    color: ${cssVar.colorTextDescription};
    text-align: right;
  `,
  valueLabel: css`
    pointer-events: none;
    font-family: 'Geist Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace;
    font-size: var(--benchmark-value-label-font-size, 12px);
    font-weight: 600;
  `,
}));
