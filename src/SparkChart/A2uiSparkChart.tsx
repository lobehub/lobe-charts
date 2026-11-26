'use client';

import { cx, Skeleton } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useId, useMemo } from 'react';
import { Area, Bar, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

import {
  A2UI_NEGATIVE,
  A2UI_POSITIVE,
  A2UI_SURFACE,
  a2uiSparkStyles as styles,
  a2uiStyles,
  A2uiTooltip,
  type ChartNumberFormat,
  createValueFormatter,
  curveA2uiMonotone,
  formatNumber,
  useA2uiThemeClass,
  useElementWidth,
} from '@/common/a2ui';
import type { CurveType, ValueFormatter } from '@/types/charts';

export type SparkTone = 'positive' | 'negative' | 'default';

/** Props the spark charts take for the a2ui look. */
export interface A2uiSparkProps {
  /** Change shown in a chip next to the value, e.g. `+12.4%` (a2ui only). */
  delta?: string;
  /** Caption above the value (a2ui only). */
  label?: string;
  /**
   * Colour of the line and the delta chip. Defaults to positive when the series ends at or above
   * where it started, negative otherwise (a2ui only).
   */
  tone?: SparkTone;
  /** Headline value. Defaults to the latest value, compact (a2ui only). */
  value?: ReactNode;
}

export interface A2uiSparkChartProps extends A2uiSparkProps {
  categories: string[];
  className?: string;
  connectNulls?: boolean;
  currency?: string;
  curveType?: CurveType;
  data: any[];
  format?: ChartNumberFormat;
  index: string;
  kind: 'area' | 'line' | 'bar';
  loading?: boolean;
  ref?: Ref<HTMLDivElement>;
  showAnimation?: boolean;
  style?: CSSProperties;
  unit?: string;
  valueFormatter?: ValueFormatter;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const HEIGHT = 44;

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `Sparkline`.
const A2uiSparkChart = ({
  kind,
  data = [],
  categories = [],
  index,
  label,
  value,
  delta,
  tone: toneProp,
  format,
  currency,
  unit,
  valueFormatter,
  curveType,
  connectNulls = false,
  loading,
  showAnimation = false,
  className,
  style,
  ref,
}: A2uiSparkChartProps) => {
  const uid = useId().replaceAll(':', '');
  const themeClass = useA2uiThemeClass();
  const [plotRef, width] = useElementWidth();
  const key = categories[0];
  const values = useMemo(() => (key ? data.map((d) => d?.[key]).filter(isNum) : []), [data, key]);
  const first = values[0];
  const last = values.at(-1);
  const tone: SparkTone =
    toneProp ??
    (values.length > 1 ? ((last as number) >= first ? 'positive' : 'negative') : 'default');
  const stroke =
    tone === 'positive' ? A2UI_POSITIVE : tone === 'negative' ? A2UI_NEGATIVE : 'var(--a2-chart-1)';
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 1;
  const formatValue = useMemo(
    () => valueFormatter ?? createValueFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );
  const headline =
    value ??
    (isNum(last)
      ? valueFormatter
        ? valueFormatter(last)
        : formatNumber(last, format === 'currency' ? 'currency' : 'compact', unit, currency)
      : '');
  const fadeId = `a2ui-spark-${uid}`;
  const lastIndex = data.length - 1;

  const renderTooltip = ({ active, payload }: any) => {
    const p = payload?.find((item: any) => item.dataKey === key);
    if (!active || !p) return null;
    return (
      <A2uiTooltip
        rows={[{ color: stroke, label: label ?? 'Value', value: formatValue(p.value) }]}
      />
    );
  };

  return (
    <div
      className={cx(themeClass, a2uiStyles.card, styles.root, className)}
      ref={ref}
      style={style}
    >
      <div className={styles.meta}>
        {label ? <div className={styles.label}>{label}</div> : null}
        <div className={styles.valueRow}>
          <span className={styles.value}>{headline}</span>
          {delta ? (
            <span
              className={cx(
                styles.chip,
                tone === 'positive'
                  ? styles.chipPositive
                  : tone === 'negative'
                    ? styles.chipNegative
                    : styles.chipNeutral,
              )}
            >
              {delta}
            </span>
          ) : null}
        </div>
      </div>
      <div className={styles.chart} ref={plotRef}>
        {loading ? (
          <Skeleton height={HEIGHT} width={'100%'} />
        ) : width > 0 && values.length > 1 ? (
          <ComposedChart
            data={data}
            height={HEIGHT}
            margin={{ bottom: 2, left: 2, right: 4, top: 4 }}
            width={width}
          >
            <defs>
              <linearGradient id={fadeId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={stroke} stopOpacity={0.3} />
                <stop offset="1" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis hide dataKey={index} padding={{ left: 0, right: 0 }} />
            <YAxis
              hide
              domain={kind === 'bar' ? [Math.min(0, min), max] : [min, max]}
              type="number"
            />
            <Tooltip
              content={renderTooltip}
              cursor={false}
              isAnimationActive={false}
              wrapperStyle={{ outline: 'none', zIndex: 1 }}
            />
            {kind === 'bar' ? (
              <Bar
                dataKey={key}
                fill={stroke}
                fillOpacity={0.85}
                isAnimationActive={showAnimation}
                radius={[2, 2, 0, 0]}
              />
            ) : null}
            {kind === 'area' ? (
              <Area
                activeDot={false}
                baseValue={min}
                connectNulls={connectNulls}
                dataKey={key}
                fill={`url(#${fadeId})`}
                fillOpacity={1}
                isAnimationActive={showAnimation}
                stroke="none"
                tooltipType="none"
                type={(curveType ?? curveA2uiMonotone) as any}
              />
            ) : null}
            {kind !== 'bar' ? (
              <Line
                activeDot={{ fill: stroke, r: 3.5, stroke: 'none' }}
                connectNulls={connectNulls}
                dataKey={key}
                isAnimationActive={showAnimation}
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                type={(curveType ?? curveA2uiMonotone) as any}
                dot={(props: any) =>
                  props.index === lastIndex ? (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      fill={stroke}
                      key="last"
                      r={2.75}
                      stroke={A2UI_SURFACE}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <g key={props.index} />
                  )
                }
              />
            ) : null}
          </ComposedChart>
        ) : null}
      </div>
    </div>
  );
};

A2uiSparkChart.displayName = 'A2uiSparkChart';

export default A2uiSparkChart;
