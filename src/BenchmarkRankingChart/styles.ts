import { createStaticStyles } from 'antd-style';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  axisLabelSpacer: css`
    flex-shrink: 0;
    width: 100%;
  `,
  bar: css`
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);

    max-width: 100%;
    border-radius: 0;

    transition: all 0.25s ${cssVar.motionEaseInOut};
  `,
  barHover: css`
    &:hover {
      .${prefixCls}-benchmark-ranking-bar {
        filter: brightness(1.08);
      }
    }
  `,
  barTrack: css`
    position: relative;
    overflow: visible;
    width: 100%;
    height: 100%;
  `,
  container: css`
    align-items: stretch;
    min-width: 0;
  `,
  emphasis: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  errorBar: css`
    pointer-events: none;

    position: absolute;
    z-index: 2;
    top: 50%;
    transform: translateY(-50%);

    height: 0;
    border-top: 1.5px solid #fff;

    mix-blend-mode: difference;

    &::before,
    &::after {
      content: '';

      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      width: 0;
      height: 10px;
      border-left: 1.5px solid #fff;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  `,
  gridLine: css`
    pointer-events: none;

    position: absolute;
    z-index: 0;
    top: 0;

    width: 0;
    border-left: 1px dashed ${cssVar.colorBorderSecondary};
  `,
  icon: css`
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 24px;
    height: 24px;
  `,
  identity: css`
    display: flex;
    flex: 1;
    gap: 10px;
    align-items: center;

    min-width: 0;
  `,
  labelColumn: css`
    flex-shrink: 0;
    min-width: 0;
    padding-right: 16px;
  `,
  labelRow: css`
    min-width: 0;
  `,
  labelStack: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    justify-content: center;

    min-width: 0;
  `,
  name: css`
    overflow: hidden;

    font-size: var(--benchmark-label-font-size, 14px);
    font-weight: 600;
    line-height: 1.3;
    color: ${cssVar.colorText};
    text-overflow: ellipsis;
    white-space: pre-line;
  `,
  nameLink: css`
    overflow: hidden;

    font-size: var(--benchmark-label-font-size, 14px);
    font-weight: 600;
    line-height: 1.3;
    color: ${cssVar.colorText} !important;
    text-overflow: ellipsis;
    white-space: pre-line;

    &:hover {
      color: ${cssVar.colorLinkHover} !important;
    }
  `,
  plot: css`
    position: relative;
    overflow: visible;
    flex: 1;
    min-width: 80px;
  `,
  plotRow: css`
    position: relative;
    width: 100%;
    min-width: 0;
  `,
  plotRows: css`
    position: relative;
    z-index: 1;
    width: 100%;
  `,
  provider: css`
    overflow: hidden;

    font-size: var(--benchmark-subtitle-font-size, 12px);
    line-height: 1.3;
    color: ${cssVar.colorTextDescription};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  rank: css`
    flex-shrink: 0;

    min-width: 20px;
    margin-right: 12px;

    font-family: 'Geist Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace;
    font-size: var(--benchmark-value-label-font-size, 14px);
    font-variant-numeric: tabular-nums;
    line-height: 1.3;
    color: ${cssVar.colorTextQuaternary};
    text-align: left;
  `,
  score: css`
    flex-shrink: 0;

    min-width: 40px;

    font-family: 'Geist Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace;
    font-size: var(--benchmark-value-label-font-size, 14px);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.3;
    color: ${cssVar.colorText};
    text-align: right;
  `,
  scoreColumn: css`
    flex-shrink: 0;
    min-width: 48px;
    padding-left: 16px;
  `,
  scoreError: css`
    margin-left: 4px;

    font-family: 'Geist Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace;
    font-size: calc(var(--benchmark-value-label-font-size, 14px) - 2px);
    font-weight: 400;
    color: ${cssVar.colorTextSecondary};
  `,
  scoreRow: css`
    width: 100%;
  `,
  tooltipTrigger: css`
    width: 100%;
    min-width: 0;
    height: 100%;
  `,
  xAxis: css`
    position: relative;
    margin-top: 4px;
    padding-top: 0;
  `,
  xAxisLabel: css`
    margin-top: 8px;

    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: ${cssVar.colorTextSecondary};
    text-align: center;
  `,
  xAxisLine: css`
    width: 100%;
    height: 0;
    border-top: 1px solid ${cssVar.colorBorder};
  `,
  xAxisTick: css`
    position: absolute;
    top: 6px;

    font-family: 'Geist Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace;
    font-size: 12px;
    line-height: 16px;
    color: ${cssVar.colorTextDescription};
    white-space: nowrap;
  `,
  xAxisTicks: css`
    position: relative;
    height: 22px;
  `,
  yAxisLine: css`
    pointer-events: none;

    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;

    width: 0;
    border-left: 1px solid ${cssVar.colorBorder};
  `,
}));
