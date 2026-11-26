import { createStaticStyles } from '@lobehub/ui';

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `CandlestickChart` header.
export const styles = createStaticStyles(({ css }) => ({
  change: css`
    font-size: 11px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
  `,
  last: css`
    font-size: 15px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    color: var(--a2-fg);
    letter-spacing: -0.025em;
  `,
  summary: css`
    text-align: end;
  `,
}));
