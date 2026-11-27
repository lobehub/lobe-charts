import { createStaticStyles } from '@lobehub/ui';

// Adapted from CopilotKit a2ui-playground (MIT): maps.tsx `RouteMap` and `Endpoint`.
export const styles = createStaticStyles(({ css, cssVar }) => ({
  connector: css`
    display: flex;
    flex: 1;
    gap: 4px;
    align-items: center;

    min-width: 24px;

    color: color-mix(in srgb, var(--a2-muted-fg) 60%, transparent);

    [data-variant='default'] & {
      color: ${cssVar.colorTextQuaternary};
    }
  `,
  connectorLine: css`
    flex: 1;
    height: 0;
    border-block-start: 1px dashed ${cssVar.colorBorder};
  `,
  endpoint: css`
    display: flex;
    flex-shrink: 1;
    gap: 8px;
    align-items: center;

    min-width: 0;
  `,
  endpointDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentcolor;
  `,
  endpointEnd: css`
    border-color: color-mix(in srgb, var(--map-accent) 30%, transparent);
    color: var(--map-accent-ink);
    background: color-mix(in srgb, var(--map-accent) 15%, transparent);
  `,
  endpointIcon: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    width: 24px;
    height: 24px;
    border: 1px solid;
    border-radius: 50%;
  `,
  endpointLabel: css`
    overflow: hidden;

    font-size: 13.5px;
    font-weight: 600;
    line-height: 1.5;
    text-overflow: ellipsis;
    letter-spacing: -0.025em;
    white-space: nowrap;

    [data-variant='default'] & {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: normal;
    }
  `,
  endpointStart: css`
    border-color: color-mix(in srgb, var(--map-start) 30%, transparent);
    color: var(--map-start);
    background: color-mix(in srgb, var(--map-start) 10%, transparent);
  `,
  endpoints: css`
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
  `,
  footer: css`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    padding-block: 10px;
    padding-inline: 16px;

    font-size: 11.5px;
    line-height: 1.5;
    color: var(--a2-muted-fg);

    [data-variant='default'] & {
      font-size: 12px;
      color: ${cssVar.colorTextDescription};
    }
  `,
  header: css`
    display: flex;
    flex-direction: column;
    gap: 10px;

    min-width: 0;
    padding-block: 14px 12px;
    padding-inline: 16px;
  `,
  legend: css`
    display: inline-flex;
    gap: 12px;
    align-items: center;
  `,
  legendDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
  `,
  legendEnd: css`
    background: var(--map-accent);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--map-accent) 30%, transparent);
  `,
  legendItem: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;
  `,
  legendStart: css`
    background: var(--map-start);
  `,
  stat: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;

    padding-block: 4px;
    padding-inline: 10px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 999px;

    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    color: ${cssVar.colorText};

    background: color-mix(in srgb, ${cssVar.colorBgElevated} 85%, transparent);
    backdrop-filter: blur(12px);
    box-shadow: ${cssVar.boxShadowSecondary};
  `,
  statIcon: css`
    color: var(--map-accent-ink);
  `,
  stats: css`
    pointer-events: none;

    position: absolute;
    z-index: 10;
    inset-block-start: 12px;
    inset-inline-start: 12px;

    display: flex;
    gap: 6px;
  `,
  tabular: css`
    font-variant-numeric: tabular-nums;
  `,
  title: css`
    overflow: hidden;

    font-size: 12.5px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--a2-muted-fg);
    text-overflow: ellipsis;
    white-space: nowrap;

    [data-variant='default'] & {
      font-size: 13px;
      color: ${cssVar.colorTextSecondary};
    }
  `,
}));
