import { createStaticStyles } from 'antd-style';

const mono = `'Geist Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace`;

export const styles = createStaticStyles(({ css, cssVar }) => ({
  axisLabel: css`
    font-size: 12px;
    fill: ${cssVar.colorTextTertiary};
  `,
  axisLine: css`
    stroke: ${cssVar.colorBorderSecondary};
    stroke-width: 1;
  `,
  container: css`
    position: relative;
    min-width: 0;
  `,
  dominatedArea: css`
    pointer-events: none;
    animation: benchmark-scatter-fade-in 0.2s ${cssVar.motionEaseOut};

    @keyframes benchmark-scatter-fade-in {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
  `,
  dominatedGuide: css`
    stroke: ${cssVar.colorTextQuaternary};
    stroke-dasharray: 3 3;
    stroke-width: 1;
  `,
  errorBar: css`
    pointer-events: none;
    stroke-width: 1.5;
  `,
  frontier: css`
    pointer-events: none;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  `,
  gridLine: css`
    stroke: ${cssVar.colorFillTertiary};
    stroke-width: 1;
  `,
  header: css`
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;

    margin-block-end: 12px;
  `,
  label: css`
    pointer-events: auto;
    cursor: default;

    position: absolute;
    z-index: 2;

    display: flex;
    flex-direction: column;
    gap: 1px;
    justify-content: center;

    white-space: nowrap;

    transition:
      left 0.4s ${cssVar.motionEaseInOut},
      top 0.4s ${cssVar.motionEaseInOut},
      opacity 0.2s;
  `,
  labelName: css`
    overflow: hidden;

    font-size: var(--benchmark-label-font-size, 12px);
    font-weight: 500;
    line-height: 1.25;
    color: ${cssVar.colorTextSecondary};
    text-overflow: ellipsis;

    transition: color 0.2s;
  `,
  labelNameEmphasis: css`
    font-weight: 600;
    color: ${cssVar.colorText};
  `,
  labelNameLink: css`
    color: inherit !important;

    &:hover {
      color: ${cssVar.colorLinkHover} !important;
    }
  `,
  labelValue: css`
    font-family: ${mono};
    font-size: var(--benchmark-value-label-font-size, 11px);
    font-variant-numeric: tabular-nums;
    line-height: 1.25;
    color: ${cssVar.colorTextQuaternary};
  `,
  legend: css`
    display: flex;
    flex: 1;
    flex-flow: row wrap;
    gap: 4px 12px;
    align-items: center;

    min-width: 0;

    font-size: 12px;
    line-height: 16px;
    color: ${cssVar.colorTextTertiary};
  `,
  legendItem: css`
    cursor: default;

    display: inline-flex;
    flex-shrink: 0;
    gap: 5px;
    align-items: center;

    transition:
      opacity 0.2s,
      color 0.2s;

    &:hover {
      color: ${cssVar.colorText};
    }
  `,
  legendMarker: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 12px;
    height: 12px;
  `,
  marker: css`
    position: absolute;
    z-index: 3;
    transform: translate(-50%, -50%);

    display: flex;
    align-items: center;
    justify-content: center;

    transition:
      left 0.4s ${cssVar.motionEaseInOut},
      top 0.4s ${cssVar.motionEaseInOut},
      opacity 0.2s,
      filter 0.2s,
      transform 0.2s;

    &:hover {
      transform: translate(-50%, -50%) scale(1.15);
    }
  `,
  markerIconRing: css`
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${cssVar.colorBgContainer};
  `,
  noTransition: css`
    transition: none !important;
  `,
  overlay: css`
    pointer-events: none;
    position: absolute;
    inset: 0;

    > * {
      pointer-events: auto;
    }
  `,
  plot: css`
    position: relative;
    width: 100%;
  `,
  tickLabel: css`
    font-family: ${mono};
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    fill: ${cssVar.colorTextQuaternary};
  `,
}));
