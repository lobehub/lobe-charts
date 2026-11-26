import { createStaticStyles } from '@lobehub/ui';

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `Heatmap` legend.
export const styles = createStaticStyles(({ css, cssVar }) => ({
  legend: css`
    display: flex;
    gap: 8px;
    align-items: center;

    padding-block-start: 2px;

    font-size: 11px;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    color: var(--a2-muted-fg);
  `,
  legendPlain: css`
    display: flex;
    gap: 8px;
    align-items: center;

    font-size: 12px;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    color: ${cssVar.colorTextDescription};
  `,
  ramp: css`
    width: 80px;
    height: 6px;
    border-radius: 9999px;
  `,
}));
