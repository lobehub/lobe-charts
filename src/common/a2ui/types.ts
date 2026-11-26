import type { ChartNumberFormat } from './format';

export type ChartVariant = 'default' | 'a2ui';

/** Props shared by every chart that has an a2ui look. */
export interface A2uiChartProps {
  /**
   * ISO 4217 code used when `format` is `currency` (a2ui only).
   * @default 'USD'
   */
  currency?: string;
  /**
   * How ticks and tooltip values are formatted in the a2ui look. `percent` expects values in 0-100.
   * `valueFormatter` still wins for tooltip values when given.
   */
  format?: ChartNumberFormat;
  /** Secondary line under the title (a2ui only). */
  subtitle?: string;
  /** Unit appended to formatted values, e.g. `ms` (a2ui only). */
  unit?: string;
  /**
   * Visual style. `a2ui` draws the chart in its own card with the A2UI palette, header legend,
   * dotted grid and tooltip.
   * @default 'default'
   */
  variant?: ChartVariant;
}
