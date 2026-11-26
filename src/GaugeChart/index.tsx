'use client';

import { cx } from '@lobehub/ui';
import type { CSSProperties, Ref } from 'react';

import {
  A2UI_NEGATIVE,
  a2uiStyles,
  type ChartNumberFormat,
  formatNumber,
  useA2uiThemeClass,
  useElementWidth,
} from '@/common/a2ui';
import type { ValueFormatter } from '@/types/charts';

import { styles } from './styles';
import { gaugeArcPath } from './utils';

export interface GaugeChartProps {
  className?: string;
  /**
   * ISO 4217 code used when `format` is `currency`.
   * @default 'USD'
   */
  currency?: string;
  /**
   * How the value and the range read. `percent` expects 0-100.
   * @default 'number'
   */
  format?: ChartNumberFormat;
  /** Caption under the value, e.g. `of 512 GPUs busy`. */
  label?: string;
  /**
   * Upper end of the range.
   * @default 100
   */
  max?: number;
  /**
   * Lower end of the range.
   * @default 0
   */
  min?: number;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  /** Card title. */
  title?: string;
  /** Unit appended to the value. */
  unit?: string;
  /** Current value. */
  value: number;
  /** Formats the centre value; wins over `format`. */
  valueFormatter?: ValueFormatter;
  /**
   * Fraction of the range from which the arc turns to the negative colour.
   * @default 0.9
   */
  warnAt?: number;
}

/** Height of the visible half ring, and of the square the ring is laid out in. */
const VISIBLE = 124;
const BOX = 240;

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `Gauge`.
const GaugeChart = ({
  value,
  min = 0,
  max: maxProp = 100,
  title,
  label,
  format = 'number',
  currency = 'USD',
  unit,
  valueFormatter,
  warnAt = 0.9,
  className,
  style,
  ref,
}: GaugeChartProps) => {
  const themeClass = useA2uiThemeClass();
  const [arcRef, width] = useElementWidth();
  const max = maxProp > min ? maxProp : min + 1;
  const current = Number.isFinite(value) ? value : min;
  const t = Math.max(0, Math.min(1, (current - min) / (max - min)));
  const tone = t >= warnAt ? A2UI_NEGATIVE : 'var(--a2-chart-1)';

  const w = Math.min(width, BOX);
  const outer = Math.max(0, Math.min(w, BOX) / 2 - 2);
  const inner = outer * 0.78;
  const cxp = width / 2;
  const cyp = BOX / 2;
  const rangeFormat: ChartNumberFormat = format === 'currency' ? 'currency' : 'compact';

  return (
    <div
      className={cx(themeClass, a2uiStyles.card, styles.root, className)}
      ref={ref}
      style={style}
    >
      {title ? <div className={styles.title}>{title}</div> : null}
      <div className={styles.arc} ref={arcRef} style={{ height: VISIBLE }}>
        {width > 0 ? (
          <svg
            aria-label={title ?? 'Gauge'}
            height={VISIBLE}
            role="img"
            style={{ display: 'block', overflow: 'hidden' }}
            width={width}
          >
            <path d={gaugeArcPath(cxp, cyp, inner, outer, 0, 1)} fill="oklch(var(--a2-ink) / 7%)" />
            {t > 0 ? <path d={gaugeArcPath(cxp, cyp, inner, outer, 0, t)} fill={tone} /> : null}
          </svg>
        ) : null}
        <div className={styles.center}>
          <div className={styles.value}>
            {valueFormatter
              ? valueFormatter(current)
              : formatNumber(current, format, unit, currency)}
          </div>
          {label ? <div className={styles.label}>{label}</div> : null}
        </div>
      </div>
      <div className={styles.range}>
        <span>{formatNumber(min, rangeFormat, undefined, currency)}</span>
        <span>{formatNumber(max, rangeFormat, undefined, currency)}</span>
      </div>
    </div>
  );
};

GaugeChart.displayName = 'GaugeChart';

export default GaugeChart;
