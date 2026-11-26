'use client';

import type { CSSProperties, ReactNode, Ref } from 'react';

import { A2uiFrame, type ChartFrameLegendItem } from '@/common/a2ui';

export type { ChartFrameLegendItem } from '@/common/a2ui';

export interface ChartFrameProps {
  /** Replaces the legend at the top right, e.g. a summary value or a colour ramp. */
  aside?: ReactNode;
  /** Chart or any custom content drawn in the card. */
  children?: ReactNode;
  className?: string;
  /** Show an empty well instead of `children`. */
  empty?: boolean;
  /**
   * Text of the empty well.
   * @default 'No data yet'
   */
  emptyText?: ReactNode;
  /** Content under the chart. */
  footer?: ReactNode;
  /**
   * Legend at the top right: labels, or `{ label, color, value }`. Shown when it has more than one
   * item; colours default to the A2UI palette.
   */
  legend?: ChartFrameLegendItem[];
  ref?: Ref<HTMLElement>;
  style?: CSSProperties;
  /** Secondary line under the title. */
  subtitle?: ReactNode;
  /** Card title. */
  title?: ReactNode;
}

/**
 * The card every a2ui chart draws in: surface, hairline border, 14px radius, soft shadow, a header with
 * title, subtitle and legend. Also sets the A2UI colour variables (`--a2-chart-1` ... `--a2-chart-6`,
 * `--a2-chart-grid`, ...) for the current light / dark mode, so custom content can use them.
 */
const ChartFrame = ({ emptyText = 'No data yet', ref, ...props }: ChartFrameProps) => (
  <A2uiFrame emptyText={emptyText} ref={ref} {...props} />
);

ChartFrame.displayName = 'ChartFrame';

export default ChartFrame;
