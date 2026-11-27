'use client';

import { cx, useTheme } from '@lobehub/ui';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useMemo } from 'react';

import { a2uiStyles, type ChartVariant, useA2uiThemeClass } from '@/common/a2ui';
import SparkAreaChart from '@/SparkChart/SparkAreaChart';

import { styles } from './styles';

export interface StockTickerStat {
  label: string;
  value: string;
}

export interface StockTickerProps {
  /** Absolute change since the previous close. */
  change?: number;
  /** Change in percent, e.g. `1.79` for +1.79%. */
  changePct?: number;
  className?: string;
  /**
   * ISO 4217 code of the price.
   * @default 'USD'
   */
  currency?: string;
  /**
   * Locale used to format the price.
   * @default 'en-US'
   */
  locale?: string;
  /** Company name under the symbol. */
  name?: string;
  /** Last price. */
  price: number;
  ref?: Ref<HTMLDivElement>;
  /** Marks the quote as illustrative with a `Sample data` badge. */
  sample?: boolean;
  /**
   * Text of the sample badge.
   * @default 'Sample data'
   */
  sampleText?: ReactNode;
  /** Recent prices, oldest first, drawn as the sparkline. Needs two or more. */
  series?: number[];
  /** Key figures under the sparkline, e.g. `{ label: 'Open', value: '179.40' }`. */
  stats?: StockTickerStat[];
  style?: CSSProperties;
  /** Ticker symbol, e.g. `HLVR`. */
  symbol: string;
  /**
   * Visual style: `default` sits with the other lobe charts; `a2ui` draws the A2UI card.
   * @default 'default'
   */
  variant?: ChartVariant;
}

const num = (v: unknown): number | undefined =>
  typeof v === 'number' && Number.isFinite(v) ? v : undefined;

const SPARK_HEIGHT = 72;
/** Room above the highest and below the lowest price, in px. */
const SPARK_PAD = 4;

// Adapted from CopilotKit a2ui-playground (MIT): domain.tsx `StockTicker`.
const StockTicker = ({
  symbol,
  name,
  price: priceProp,
  change: changeProp,
  changePct: pctProp,
  currency = 'USD',
  locale = 'en-US',
  series: seriesProp,
  stats: statsProp,
  sample,
  sampleText = 'Sample data',
  variant = 'default',
  className,
  style,
  ref,
}: StockTickerProps) => {
  const theme = useTheme();
  const themeClass = useA2uiThemeClass();
  const a2ui = variant === 'a2ui';
  const price = num(priceProp);
  const change = num(changeProp);
  const pct = num(pctProp);
  const series = useMemo(
    () => (Array.isArray(seriesProp) ? seriesProp.filter((n) => num(n) !== undefined) : []),
    [seriesProp],
  );
  const stats = (Array.isArray(statsProp) ? statsProp : []).filter((s) => s && s.label);
  const trend = change ?? pct ?? (series.length > 1 ? series.at(-1)! - series[0] : 0);
  const up = trend >= 0;
  const tone = up ? theme.colorSuccess : theme.colorError;

  const fmt = (v: number) => {
    try {
      return new Intl.NumberFormat(locale, {
        currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'currency',
      }).format(v);
    } catch {
      return v.toFixed(2);
    }
  };

  const spark = useMemo(() => {
    if (series.length < 2) return null;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    // Pad the domain so the line keeps SPARK_PAD px off the top and bottom edges.
    const pad = (range * SPARK_PAD) / (SPARK_HEIGHT - SPARK_PAD * 2);
    const lo = min - pad;
    const hi = max + pad;
    const baseline = 1 + (1 - (series[0] - lo) / (hi - lo)) * (SPARK_HEIGHT - 2);
    return {
      baseline,
      data: series.map((value, i) => ({ i, value })),
      hi,
      lo,
    };
  }, [series]);

  const ArrowIcon = up ? ArrowUpRight : ArrowDownRight;
  const sign = up ? '+' : '';

  return (
    <div
      className={cx(themeClass, a2ui ? cx(a2uiStyles.card, styles.card) : styles.plain, className)}
      data-variant={variant}
      ref={ref}
      style={style}
    >
      <div className={styles.head}>
        <div className={styles.identity}>
          <span className={styles.mark}>{symbol.slice(0, 4)}</span>
          <span className={styles.names}>
            <span className={styles.symbol}>{symbol}</span>
            {name ? <span className={styles.name}>{name}</span> : null}
          </span>
        </div>
        {sample ? <span className={styles.sample}>{sampleText}</span> : null}
      </div>
      <div className={styles.quote}>
        <span className={styles.price}>{price === undefined ? '--' : fmt(price)}</span>
        {change !== undefined || pct !== undefined ? (
          <span className={cx(styles.change, up ? styles.up : styles.down)}>
            <ArrowIcon size={16} />
            {change === undefined ? '' : `${sign}${change.toFixed(2)}`}
            {pct === undefined ? '' : ` (${sign}${pct.toFixed(2)}%)`}
          </span>
        ) : null}
      </div>
      {spark ? (
        <div className={styles.spark}>
          <svg aria-hidden className={styles.baseline} height={SPARK_HEIGHT} width="100%">
            <line
              stroke="currentColor"
              strokeDasharray="2 4"
              x1="0"
              x2="100%"
              y1={spark.baseline}
              y2={spark.baseline}
            />
          </svg>
          <SparkAreaChart
            categories={['value']}
            colors={[tone]}
            curveType="linear"
            data={spark.data}
            height={SPARK_HEIGHT}
            index="i"
            maxValue={spark.hi}
            minValue={spark.lo}
            width="100%"
          />
        </div>
      ) : (
        <div className={styles.sparkEmpty} />
      )}
      {stats.length > 0 ? (
        <div className={styles.stats}>
          {stats.map((s) => (
            <div className={styles.stat} key={s.label}>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statValue}>{s.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

StockTicker.displayName = 'StockTicker';

export default StockTicker;
