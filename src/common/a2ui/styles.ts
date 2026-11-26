import { createStaticStyles } from '@lobehub/ui';

import { A2UI_DARK_VARS, A2UI_LIGHT_VARS } from './tokens';

// Adapted from CopilotKit a2ui-playground (MIT): `.a2-card`, `.a2-well` (globals.css) and ChartFrame /
// Legend / tooltip chrome (chart-kit.tsx).
export const styles = createStaticStyles(({ css }) => ({
  card: css`
    position: relative;

    overflow: hidden;

    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    border: 1px solid var(--a2-line);
    border-radius: 14px;

    font-variant-numeric: normal;
    color: var(--a2-chart-ink);

    background: linear-gradient(180deg, var(--a2-card-sheen), transparent 40%), var(--a2-surface);
    box-shadow: var(--a2-card-shadow);

    & svg text {
      font-family: inherit;
    }

    & .recharts-surface,
    & .recharts-wrapper {
      overflow: visible;
      outline: none;
    }

    & .recharts-sector,
    & .recharts-rectangle,
    & .recharts-layer {
      outline: none;
    }
  `,
  dark: css`
    ${A2UI_DARK_VARS}
  `,
  empty: css`
    display: grid;
    place-items: center;

    height: 144px;
    border: 1px solid var(--a2-line);
    border-radius: 10px;

    font-size: 12px;
    color: var(--a2-muted-fg);

    background: oklch(var(--a2-ink) / 3%);
  `,
  frame: css`
    display: flex;
    flex-direction: column;
    gap: 12px;

    padding-block: 14px 12px;
    padding-inline: 16px;
  `,
  header: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    align-items: flex-start;
    justify-content: space-between;

    min-width: 0;
  `,
  headerText: css`
    min-width: 0;
  `,
  legend: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    align-items: center;

    padding-block-start: 2px;
  `,
  legendItem: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;

    min-width: 0;

    font-size: 11.5px;
    line-height: 1.5;
    color: var(--a2-muted-fg);
  `,
  legendLabel: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  legendValue: css`
    font-variant-numeric: tabular-nums;
    color: color-mix(in oklch, var(--a2-fg) 85%, transparent);
  `,
  light: css`
    ${A2UI_LIGHT_VARS}
  `,
  plot: css`
    position: relative;
    width: 100%;
    min-width: 0;
  `,
  subtitle: css`
    margin-block-start: 2px;
    font-size: 11.5px;
    line-height: 1.375;
    color: var(--a2-muted-fg);
  `,
  swatch: css`
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 3px;
  `,
  title: css`
    overflow: hidden;

    font-size: 13.5px;
    font-weight: 600;
    line-height: 1.5;
    color: var(--a2-fg);
    text-overflow: ellipsis;
    letter-spacing: -0.025em;
    white-space: nowrap;
  `,
  tooltip: css`
    pointer-events: none;

    max-width: 240px;
    padding-block: 8px;
    padding-inline: 10px;
    border: 1px solid var(--a2-tooltip-border);
    border-radius: 10px;

    font-size: 11.5px;
    font-weight: 500;
    line-height: 1.45;
    color: var(--a2-tooltip-fg);
    overflow-wrap: anywhere;

    background: var(--a2-tooltip-bg);
    box-shadow: var(--a2-tooltip-shadow);
  `,
  tooltipRow: css`
    display: grid;
    grid-template-columns: 0.55rem minmax(0, 1fr) auto;
    column-gap: 0.4rem;
    align-items: center;
  `,
  tooltipRowActive: css`
    border-radius: 0.2rem;
    font-weight: 700;
    background: color-mix(in srgb, currentcolor 12%, transparent);
    box-shadow: 0 0 0 2px color-mix(in srgb, currentcolor 12%, transparent);
  `,
  tooltipSwatch: css`
    display: block;

    width: 0.55rem;
    height: 0.55rem;
    border-radius: 0.15rem;

    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 12%);
  `,
  tooltipTitle: css`
    display: flex;
    gap: 0.4rem;
    align-items: center;

    margin-block-end: 0.3rem;

    font-weight: 650;
  `,
  tooltipValue: css`
    font-variant-numeric: tabular-nums;
    text-align: end;
    white-space: nowrap;
  `,
}));

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `Sparkline`.
export const sparkStyles = createStaticStyles(({ css }) => ({
  chart: css`
    flex: 1;
    min-width: 0;
    height: 44px;
  `,
  chip: css`
    padding-block: 2px;
    padding-inline: 6px;
    border-radius: 6px;

    font-size: 11px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
  `,
  chipNegative: css`
    color: var(--a2-negative);
    background: color-mix(in oklch, var(--a2-negative) 14%, transparent);
  `,
  chipNeutral: css`
    color: var(--a2-muted-fg);
    background: var(--a2-chip-neutral);
  `,
  chipPositive: css`
    color: var(--a2-positive);
    background: color-mix(in oklch, var(--a2-positive) 14%, transparent);
  `,
  label: css`
    overflow: hidden;

    font-size: 11.5px;
    line-height: 1.5;
    color: var(--a2-muted-fg);
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  meta: css`
    flex-shrink: 0;
    min-width: 0;
  `,
  root: css`
    display: flex;
    gap: 16px;
    align-items: center;

    padding-block: 12px;
    padding-inline: 16px;
  `,
  value: css`
    font-size: 18px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    color: var(--a2-fg);
    letter-spacing: -0.025em;
  `,
  valueRow: css`
    display: flex;
    gap: 8px;
    align-items: baseline;
    margin-block-start: 2px;
  `,
}));
