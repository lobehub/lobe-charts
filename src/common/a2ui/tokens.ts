// Colour tokens of the a2ui look. Every value is a LobeHub theme token (`cssVar`), so the a2ui and
// default variants share colours and dark mode comes from the theme. The variables are set on the chart
// frame; series colours come from `useThemeColorRange()`, like the default charts. The card and tooltip
// surfaces are @lobehub/ui's `--lobe-a2ui-surface` steps (a card one step above the A2UI floor, a
// tooltip one above the card in dark), falling back to the container / elevated colours.
// Layout and type follow CopilotKit a2ui-playground (MIT); the colours are ours.
import { cssVar } from '@lobehub/ui';

export const A2UI_VARS = `
  --a2-fg: ${cssVar.colorText};
  --a2-muted-fg: ${cssVar.colorTextSecondary};
  --a2-surface: var(--lobe-a2ui-surface, ${cssVar.colorBgContainer});
  --a2-line: ${cssVar.colorBorderSecondary};
  --a2-positive: ${cssVar.colorSuccess};
  --a2-negative: ${cssVar.colorError};
  --a2-warning: ${cssVar.colorWarning};
  --a2-info: ${cssVar.colorInfo};
  --a2-card-shadow: ${cssVar.boxShadowTertiary};
  --a2-chart-ink: ${cssVar.colorTextSecondary};
  --a2-chart-fg: ${cssVar.colorText};
  --a2-chart-muted: ${cssVar.colorTextSecondary};
  --a2-chart-grid: ${cssVar.colorBorderSecondary};
  --a2-chart-hairline: ${cssVar.colorBorder};
  --a2-chart-name: ${cssVar.colorTextSecondary};
  --a2-chart-focus: ${cssVar.colorText};
  --a2-heat-low: ${cssVar.colorFillTertiary};
  --a2-track: ${cssVar.colorFillSecondary};
  --a2-well: ${cssVar.colorFillQuaternary};
  --a2-tooltip-bg: var(--lobe-a2ui-surface-2, ${cssVar.colorBgElevated});
  --a2-tooltip-fg: ${cssVar.colorText};
  --a2-tooltip-border: ${cssVar.colorBorderSecondary};
  --a2-tooltip-shadow: ${cssVar.boxShadowSecondary};
  --a2-chip-neutral: ${cssVar.colorFillTertiary};
`;

/** Colour at index `i` of a palette (wraps). Pass the theme colour range as `palette`. */
export const a2uiPaletteAt = (i: number, palette: string[]) =>
  palette[((i % palette.length) + palette.length) % palette.length];

export const A2UI_POSITIVE = 'var(--a2-positive)';
export const A2UI_NEGATIVE = 'var(--a2-negative)';
export const A2UI_SURFACE = 'var(--a2-surface)';

/** Dotted hairline grid. */
export const A2UI_GRID = {
  stroke: 'var(--a2-chart-grid)',
  strokeDasharray: '2 4',
} as const;

/** Tick label paint, as official: muted text at 68%. */
export const A2UI_TICK = {
  fill: 'var(--a2-chart-muted)',
  fillOpacity: 0.68,
  fontSize: 11,
} as const;
