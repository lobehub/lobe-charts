// Colour tokens of the a2ui look, per theme. Every value is a CSS variable set on the chart frame, so a
// chart follows the page from light to dark without being rebuilt.
// Adapted from CopilotKit a2ui-playground (MIT): src/app/globals.css (--a2-*, --ts-chart-*) and
// src/a2ui/catalog/renderers/renderers.css.

export const A2UI_LIGHT_VARS = `
  --a2-ink: 0.21 0.012 285;
  --a2-fg: oklch(0.2 0.008 285);
  --a2-muted-fg: oklch(0.47 0.014 285);
  --a2-chart-1: oklch(0.55 0.2 292);
  --a2-chart-2: oklch(0.58 0.13 230);
  --a2-chart-3: oklch(0.6 0.14 162);
  --a2-chart-4: oklch(0.7 0.15 72);
  --a2-chart-5: oklch(0.6 0.2 18);
  --a2-chart-6: oklch(0.6 0.03 285);
  --a2-surface: oklch(1 0 0);
  --a2-line: oklch(0.21 0.012 285 / 9%);
  --a2-positive: oklch(0.52 0.13 160);
  --a2-negative: oklch(0.56 0.2 22);
  --a2-card-sheen: transparent;
  --a2-card-shadow: 0 1px 2px oklch(0.21 0.012 285 / 6%), 0 1px 3px oklch(0.21 0.012 285 / 4%);
  --a2-chart-ink: oklch(0.45 0.012 285);
  --a2-chart-fg: oklch(0.28 0.01 285);
  --a2-chart-muted: oklch(0.52 0.012 285);
  --a2-chart-grid: oklch(0.21 0.012 285 / 10%);
  --a2-chart-label: oklch(0.34 0.01 285);
  --a2-chart-focus: oklch(0.21 0.012 285);
  --a2-chart-mute-1: oklch(0.8 0.008 285);
  --a2-chart-mute-2: oklch(0.74 0.008 285);
  --a2-chart-mute-3: oklch(0.86 0.008 285);
  --a2-chart-mute-4: oklch(0.7 0.008 285);
  --a2-heat-low: oklch(0.965 0.006 285);
  --a2-heat-legend-low: oklch(0.965 0.006 285);
  --a2-heat-ink-hi: oklch(0.2 0.02 292);
  --a2-heat-ink-lo: oklch(0.32 0.01 285);
  --a2-treemap-ink: oklch(0.17 0.02 285);
  --a2-tooltip-bg: oklch(1 0 0 / 97%);
  --a2-tooltip-fg: oklch(0.22 0.008 285);
  --a2-tooltip-border: oklch(0.21 0.012 285 / 10%);
  --a2-tooltip-shadow: 0 12px 32px oklch(0.21 0.012 285 / 14%);
  --a2-chip-neutral: oklch(0 0 0 / 5%);
`;

export const A2UI_DARK_VARS = `
  --a2-ink: 1 0 0;
  --a2-fg: oklch(0.97 0.003 285);
  --a2-muted-fg: oklch(0.68 0.012 285);
  --a2-chart-1: oklch(0.72 0.17 292);
  --a2-chart-2: oklch(0.76 0.12 225);
  --a2-chart-3: oklch(0.79 0.15 162);
  --a2-chart-4: oklch(0.83 0.14 78);
  --a2-chart-5: oklch(0.71 0.18 12);
  --a2-chart-6: oklch(0.7 0.03 285);
  --a2-surface: oklch(0.172 0.005 285);
  --a2-line: oklch(1 0 0 / 7.5%);
  --a2-positive: oklch(0.78 0.15 160);
  --a2-negative: oklch(0.7 0.18 18);
  --a2-card-sheen: oklch(1 0 0 / 2.2%);
  --a2-card-shadow: inset 0 1px 0 oklch(1 0 0 / 4%), 0 1px 2px oklch(0 0 0 / 30%);
  --a2-chart-ink: oklch(0.78 0.01 285);
  --a2-chart-fg: oklch(0.93 0.004 285);
  --a2-chart-muted: oklch(0.6 0.012 285);
  --a2-chart-grid: oklch(1 0 0 / 6.5%);
  --a2-chart-label: oklch(0.86 0.008 285);
  --a2-chart-focus: oklch(0.97 0 0);
  --a2-chart-mute-1: oklch(0.47 0.012 285);
  --a2-chart-mute-2: oklch(0.4 0.012 285);
  --a2-chart-mute-3: oklch(0.54 0.012 285);
  --a2-chart-mute-4: oklch(0.36 0.012 285);
  --a2-heat-low: oklch(0.27 0.01 285);
  --a2-heat-legend-low: oklch(0.24 0.008 285);
  --a2-heat-ink-hi: oklch(0.18 0.02 292);
  --a2-heat-ink-lo: oklch(0.86 0.01 285);
  --a2-treemap-ink: oklch(0.17 0.02 285);
  --a2-tooltip-bg: oklch(0.2 0.006 285 / 94%);
  --a2-tooltip-fg: oklch(0.95 0.004 285);
  --a2-tooltip-border: oklch(1 0 0 / 10%);
  --a2-tooltip-shadow: 0 12px 32px oklch(0 0 0 / 45%);
  --a2-chip-neutral: oklch(1 0 0 / 5%);
`;

/** Series palette, violet first. */
export const A2UI_PALETTE = [
  'var(--a2-chart-1)',
  'var(--a2-chart-2)',
  'var(--a2-chart-3)',
  'var(--a2-chart-4)',
  'var(--a2-chart-5)',
  'var(--a2-chart-6)',
];

export const a2uiPaletteAt = (i: number, palette: string[] = A2UI_PALETTE) =>
  palette[((i % palette.length) + palette.length) % palette.length];

export const A2UI_POSITIVE = 'var(--a2-positive)';
export const A2UI_NEGATIVE = 'var(--a2-negative)';
export const A2UI_SURFACE = 'var(--a2-surface)';

/** Dotted hairline grid. The official grid group also sets `stroke-opacity: 0.11`. */
export const A2UI_GRID = {
  stroke: 'var(--a2-chart-grid)',
  strokeDasharray: '2 4',
  strokeOpacity: 0.11,
} as const;

/** Tick label paint, as official: muted ink at 68%. */
export const A2UI_TICK = {
  fill: 'var(--a2-chart-muted)',
  fillOpacity: 0.68,
  fontSize: 11,
} as const;
