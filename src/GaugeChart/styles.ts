import { createStaticStyles } from '@lobehub/ui';

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `Gauge`.
export const styles = createStaticStyles(({ css }) => ({
  arc: css`
    position: relative;

    overflow: hidden;

    width: 100%;
    max-width: 240px;
    margin-block-start: 8px;
  `,
  center: css`
    pointer-events: none;

    position: absolute;
    inset-block-end: 0;
    inset-inline: 0;

    text-align: center;
  `,
  label: css`
    margin-block-start: 6px;
    font-size: 11.5px;
    line-height: 1.5;
    color: var(--a2-muted-fg);
  `,
  range: css`
    display: flex;
    justify-content: space-between;

    width: 100%;
    max-width: 240px;
    margin-block-start: 4px;

    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    color: var(--a2-muted-fg);
  `,
  root: css`
    display: flex;
    flex-direction: column;
    align-items: center;

    padding-block: 14px 12px;
    padding-inline: 16px;
  `,
  title: css`
    overflow: hidden;

    width: 100%;

    font-size: 13.5px;
    font-weight: 600;
    line-height: 1.5;
    color: var(--a2-fg);
    text-overflow: ellipsis;
    letter-spacing: -0.025em;
    white-space: nowrap;
  `,
  value: css`
    font-size: 26px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: var(--a2-fg);
    letter-spacing: -0.025em;
  `,
}));
