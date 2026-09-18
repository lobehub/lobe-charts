import type { HTMLAttributes, ReactNode } from 'react';

import type { NoDataProps } from '@/common/NoData';
import type { ValueFormatter } from '@/types/charts';

export interface BenchmarkRecord {
  [key: string]: any;
  color?: string;
  error?: number;
  highlighted?: boolean;
  href?: string;
  icon?: ReactNode;
  key?: string;
  /**
   * Secondary line-series value (e.g. Pass¹ overall rate)
   */
  line?: number;
  name?: ReactNode;
  provider?: ReactNode;
  rank?: number;
  score?: number;
  target?: string;
  /**
   * Place item after a visual separator; line series does not connect into it
   */
  unranked?: boolean;
}

export type BenchmarkRenderIcon = (record: BenchmarkRecord, index: number) => ReactNode;

export type BenchmarkEventProps =
  | (BenchmarkRecord & {
      eventType: 'bar' | 'row';
      value: number;
    })
  | null
  | undefined;

export interface BenchmarkFieldKeys {
  /**
   * Per-item bar color field
   * @default 'color'
   */
  colorKey?: string;
  /**
   * Error / uncertainty field (AccuracyBar-style ± display)
   * @default 'error'
   */
  errorKey?: string;
  /**
   * Icon field; value should be a ReactNode provided by the consumer
   * @default 'icon'
   */
  iconKey?: string;
  /**
   * Model / entry name field
   * @default 'name'
   */
  index?: string;
  /**
   * Secondary line-series field
   * @default 'line'
   */
  lineKey?: string;
  /**
   * Provider / organization field
   * @default 'provider'
   */
  providerKey?: string;
  /**
   * Numeric score field
   * @default 'score'
   */
  valueKey?: string;
}

export interface BenchmarkBaseProps
  extends BenchmarkFieldKeys, Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Accuracy-style value formatter (e.g. `52.0%`). Falls back to `valueFormatter`.
   */
  accuracyFormatter?: (value: number) => string;
  data?: BenchmarkRecord[];
  /**
   * Formats the ± error segment
   * @default (n) => n.toFixed(1)
   */
  errorFormatter?: (value: number) => string;
  height?: string | number;
  /**
   * Text accent color when an item has `highlighted: true` (does not change bar fill)
   * @default theme.gold
   */
  highlightColor?: string;
  loading?: boolean;
  noDataText?: NoDataProps['noDataText'];
  onValueChange?: (value: BenchmarkEventProps) => void;
  /**
   * Optional icon renderer that overrides `iconKey`
   */
  renderIcon?: BenchmarkRenderIcon;
  showAnimation?: boolean;
  /**
   * Show AccuracyBar-style ± error next to values / error bars
   * @default true
   */
  showError?: boolean;
  sortOrder?: 'ascending' | 'descending' | 'none';
  valueFormatter?: ValueFormatter;
  width?: string | number;
}

export interface NormalizedBenchmarkItem {
  color?: string;
  error?: number;
  highlighted?: boolean;
  href?: string;
  icon?: ReactNode;
  key: string | number;
  lineValue?: number;
  name: ReactNode;
  original: BenchmarkRecord;
  provider?: ReactNode;
  rank: number;
  target?: string;
  unranked?: boolean;
  value: number;
}
