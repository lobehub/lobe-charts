import { createStaticStyles } from '@lobehub/ui';

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `PieChart` layout.
export const a2uiStyles = createStaticStyles(({ css }) => ({
  body: css`
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
    align-items: center;

    min-width: 0;
  `,
  center: css`
    pointer-events: none;

    position: absolute;
    inset: 0;

    display: grid;
    place-items: center;

    text-align: center;
  `,
  centerLabel: css`
    font-size: 11px;
    line-height: 1.5;
    color: var(--a2-muted-fg);
  `,
  chart: css`
    position: relative;
    flex-shrink: 0;
  `,
  item: css`
    display: flex;
    gap: 8px;
    align-items: center;

    min-width: 0;

    font-size: 12px;
    line-height: 1.5;
  `,
  itemLabel: css`
    overflow: hidden;
    flex: 1;

    min-width: 0;

    color: var(--a2-muted-fg);
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  itemPercent: css`
    width: 44px;
    font-variant-numeric: tabular-nums;
    color: var(--a2-muted-fg);
    text-align: end;
  `,
  itemValue: css`
    font-variant-numeric: tabular-nums;
    color: color-mix(in oklch, var(--a2-fg) 90%, transparent);
  `,
  list: css`
    display: grid;
    flex: 1;
    gap: 6px;

    min-width: 180px;
    margin: 0;
    padding: 0;

    list-style: none;
  `,
  swatch: css`
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 3px;
  `,
  total: css`
    font-size: 20px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    color: var(--a2-fg);
    letter-spacing: -0.025em;
  `,
}));
