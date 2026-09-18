'use client';

import { A, Flexbox, Skeleton } from '@lobehub/ui';
import { Tooltip } from 'antd';
import { cssVar, cx, useTheme } from 'antd-style';
import { type CSSProperties, type ReactNode, forwardRef, useMemo, useState } from 'react';

import ChartTooltip from '@/common/ChartTooltip';
import NoData from '@/common/NoData';
import {
  type BenchmarkBaseProps,
  type BenchmarkEventProps,
  type NormalizedBenchmarkItem,
  defaultBenchmarkErrorFormatter,
  defaultBenchmarkValueFormatter,
  formatBenchmarkAccuracyDisplay,
  getBenchmarkBarPercent,
  normalizeBenchmarkData,
} from '@/common/benchmark';

import { styles } from './styles';

export interface BenchmarkRankingChartProps extends BenchmarkBaseProps {
  /**
   * Thickness of the horizontal score bar
   * @default 24
   */
  barSize?: number;
  /**
   * Fallback bar color when an item has no color
   */
  color?: string;
  /**
   * Text accent color when an item has `highlighted: true` (does not change bar fill)
   * @default theme.gold
   */
  highlightColor?: string;
  /**
   * Font size for the model name
   * @default 14
   */
  labelFontSize?: number;
  /**
   * Display width of the left label (icon + name + provider).
   * Omit to size to the longest label.
   */
  labelWidth?: number | string;
  /**
   * Override domain max used for bar scaling
   */
  maxValue?: number;
  /**
   * Custom rank renderer. Receives the normalized item; default is `#${rank}`.
   */
  renderRank?: (item: NormalizedBenchmarkItem) => ReactNode;
  /**
   * Height of each ranking row
   * @default 40
   */
  rowHeight?: number;
  /**
   * Show AccuracyBar-style horizontal error bars
   * @default true
   */
  showErrorBars?: boolean;
  /**
   * Show vertical grid lines in the plot
   * @default true
   */
  showGridLines?: boolean;
  /**
   * Show rank on the left (default `#1`, `#2`, ...)
   * @default true
   */
  showRank?: boolean;
  /**
   * Show tooltip on row hover
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Show numeric score labels on the right
   * @default true
   */
  showValueLabel?: boolean;
  /**
   * Show X value axis line + ticks under the bars
   * @default false
   */
  showXAxis?: boolean;
  /**
   * Show Y axis line along the plot
   * @default true
   */
  showYAxis?: boolean;
  /**
   * Font size for the numeric score
   * @default 14
   */
  valueLabelFontSize?: number;
  /**
   * Optional X axis title under the ticks
   */
  xAxisLabel?: string;
}

const prefixCls = 'ant';

const getAxisTicks = (max: number, count = 4) => {
  if (max <= 0) return [0];
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const stepBase = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const step = stepBase * magnitude;
  const ticks: number[] = [];
  for (let value = 0; value <= max + step / 1000; value += step) {
    ticks.push(Math.min(Number(value.toFixed(6)), max));
  }
  if (ticks.at(-1) !== max) ticks.push(max);
  return [...new Set(ticks)];
};

const BenchmarkRankingChart = forwardRef<HTMLDivElement, BenchmarkRankingChartProps>(
  (props, ref) => {
    const theme = useTheme();
    const {
      data = [],
      index,
      valueKey,
      providerKey,
      iconKey,
      colorKey,
      errorKey,
      renderIcon,
      color = cssVar.colorPrimary,
      highlightColor,
      valueFormatter = defaultBenchmarkValueFormatter,
      accuracyFormatter,
      errorFormatter = defaultBenchmarkErrorFormatter,
      showError = true,
      showErrorBars = true,
      showAnimation = false,
      onValueChange,
      sortOrder = 'descending',
      className,
      style,
      loading,
      width = '100%',
      height,
      noDataText,
      barSize = 24,
      rowHeight = 40,
      labelWidth,
      labelFontSize = 14,
      valueLabelFontSize = 14,
      maxValue,
      renderRank,
      showRank = true,
      showValueLabel = true,
      showTooltip = true,
      showGridLines = true,
      showXAxis = false,
      showYAxis = true,
      xAxisLabel,
      ...rest
    } = props;

    const resolvedHighlightColor = highlightColor ?? theme.gold;

    const [activeKey, setActiveKey] = useState<string | number | undefined>();
    const enableErrorBars = showError && showErrorBars;
    const displayFormatter = accuracyFormatter ?? valueFormatter;

    const items = useMemo(
      () =>
        normalizeBenchmarkData({
          colorKey,
          data,
          errorKey,
          iconKey,
          index,
          providerKey,
          renderIcon,
          sortOrder,
          valueKey,
        }),
      [colorKey, data, errorKey, iconKey, index, providerKey, renderIcon, sortOrder, valueKey],
    );

    const resolvedMaxValue = useMemo(() => {
      if (typeof maxValue === 'number') return maxValue;
      return Math.max(
        ...items.map((item) => item.value + (enableErrorBars ? (item.error ?? 0) : 0)),
        0,
      );
    }, [enableErrorBars, items, maxValue]);

    const axisTicks = useMemo(() => getAxisTicks(resolvedMaxValue), [resolvedMaxValue]);
    const hasLabelWidth = labelWidth !== undefined && labelWidth !== null && labelWidth !== '';
    const labelWidthStyle = typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth;
    const gridTicks = axisTicks.filter((tick) => tick > 0 && tick < resolvedMaxValue);

    if (loading || !data) return <Skeleton.Block active height={height ?? 280} width={width} />;

    const handleClick = (item: NormalizedBenchmarkItem) => {
      if (!onValueChange) return;

      if (activeKey === item.key) {
        setActiveKey(undefined);
        onValueChange(null);
        return;
      }

      setActiveKey(item.key);
      const payload: BenchmarkEventProps = {
        ...item.original,
        eventType: 'row',
        rank: item.rank,
        value: item.value,
      };
      onValueChange(payload);
    };

    const renderRowTooltip = (
      item: NormalizedBenchmarkItem,
      child: ReactNode,
      key: string,
      fillTrigger = true,
    ) => {
      const trigger = (
        <div
          className={styles.tooltipTrigger}
          style={fillTrigger ? undefined : { minWidth: 'max-content', width: 'auto' }}
        >
          {child}
        </div>
      );

      if (!showTooltip) return <div key={key}>{trigger}</div>;

      const modelName = String(item.name).replaceAll('\n', ' ');
      const metricName = accuracyFormatter ? 'Accuracy' : 'Score';
      const title = item.provider ? String(item.provider) : metricName;
      const swatch = item.color ?? color;

      return (
        <Tooltip
          arrow={false}
          key={key}
          mouseEnterDelay={0.05}
          styles={{
            container: {
              background: 'transparent',
              boxShadow: 'none',
              maxWidth: 'none',
              padding: 0,
              width: 'max-content',
            },
            root: {
              maxWidth: 'none',
            },
          }}
          title={
            <ChartTooltip
              active
              categoryColors={new Map([[modelName, swatch]])}
              label={title}
              payload={[
                {
                  color: swatch,
                  dataKey: '__value',
                  name: modelName,
                  value: item.value,
                },
              ]}
              valueFormatter={(val: number): any => {
                if (!showError || item.error === undefined || item.error === null) {
                  return displayFormatter(Number(val));
                }
                return (
                  <>
                    {displayFormatter(Number(val))}
                    <span style={{ color: cssVar.colorTextSecondary }}>
                      {' '}
                      ± {errorFormatter(Number(item.error))}
                    </span>
                  </>
                );
              }}
            />
          }
        >
          {trigger}
        </Tooltip>
      );
    };

    const toPercent = (value: number) =>
      resolvedMaxValue <= 0 ? 0 : Math.max(0, Math.min(100, (value / resolvedMaxValue) * 100));

    return (
      <Flexbox
        className={cx(styles.container, className)}
        gap={0}
        horizontal
        ref={ref}
        style={
          {
            '--benchmark-label-font-size': `${labelFontSize}px`,
            '--benchmark-subtitle-font-size': `${Math.max(10, labelFontSize - 2)}px`,
            '--benchmark-value-label-font-size': `${valueLabelFontSize}px`,
            'minHeight': height,
            'position': 'relative',
            ...style,
          } as CSSProperties
        }
        width={width}
        {...rest}
      >
        <Flexbox
          className={styles.labelColumn}
          gap={8}
          style={{
            flex: hasLabelWidth ? `0 0 ${labelWidthStyle}` : '0 0 auto',
            minWidth: hasLabelWidth ? 0 : 'max-content',
            width: hasLabelWidth ? labelWidthStyle : 'auto',
          }}
          width={hasLabelWidth ? labelWidth : 'auto'}
        >
          {items.map((item) => {
            const textColor = item.highlighted ? resolvedHighlightColor : undefined;

            return renderRowTooltip(
              item,
              <Flexbox
                align="center"
                className={styles.labelRow}
                height={rowHeight}
                horizontal
                onClick={() => handleClick(item)}
                style={{ cursor: onValueChange ? 'pointer' : 'default' }}
                width="100%"
              >
                {showRank ? (
                  <div className={styles.rank} style={textColor ? { color: textColor } : undefined}>
                    {renderRank ? renderRank(item) : `#${item.rank}`}
                  </div>
                ) : null}
                <Flexbox className={styles.identity} horizontal>
                  {item.icon ? <div className={styles.icon}>{item.icon}</div> : null}
                  <div className={styles.labelStack}>
                    {item.href ? (
                      <A
                        className={cx(styles.nameLink, styles.emphasis)}
                        href={item.href}
                        onClick={(event) => event.stopPropagation()}
                        style={textColor ? { color: textColor } : undefined}
                        target={item.target}
                      >
                        {item.name}
                      </A>
                    ) : (
                      <div
                        className={cx(styles.name, styles.emphasis)}
                        style={textColor ? { color: textColor } : undefined}
                      >
                        {item.name}
                      </div>
                    )}
                    {item.provider ? (
                      <div
                        className={cx(styles.provider, styles.emphasis)}
                        style={textColor ? { color: textColor } : undefined}
                      >
                        {item.provider}
                      </div>
                    ) : null}
                  </div>
                </Flexbox>
              </Flexbox>,
              `label-${item.key}`,
              hasLabelWidth,
            );
          })}
          {showXAxis ? (
            <div className={styles.axisLabelSpacer} style={{ minHeight: xAxisLabel ? 44 : 28 }} />
          ) : null}
        </Flexbox>

        <div className={styles.plot}>
          {showYAxis ? (
            <div
              className={styles.yAxisLine}
              style={{ bottom: showXAxis ? (xAxisLabel ? 44 : 28) : 0 }}
            />
          ) : null}
          {showGridLines
            ? gridTicks.map((tick) => (
                <div
                  className={styles.gridLine}
                  key={`grid-${tick}`}
                  style={{
                    bottom: showXAxis ? (xAxisLabel ? 44 : 28) : 0,
                    left: `${toPercent(tick)}%`,
                  }}
                />
              ))
            : null}

          <Flexbox className={styles.plotRows} gap={8} role="list">
            {items.map((item) => {
              const barColor = item.color ?? color;
              const percent = getBenchmarkBarPercent(item.value, resolvedMaxValue);
              const isActive = activeKey === item.key;
              const display = formatBenchmarkAccuracyDisplay({
                accuracyFormatter,
                error: item.error,
                errorFormatter,
                showError,
                value: item.value,
                valueFormatter,
              });
              const errorPct =
                enableErrorBars && item.error !== undefined && item.error !== null
                  ? toPercent(item.error)
                  : 0;
              const errorLeft = Math.max(0, percent - errorPct);
              const errorWidth = Math.min(100 - errorLeft, errorPct * 2);

              return renderRowTooltip(
                item,
                <Flexbox
                  aria-label={`Rank ${item.rank}: ${String(item.name)}${item.provider ? ` by ${String(item.provider)}` : ''}, score ${display.text}`}
                  className={cx(styles.plotRow, onValueChange && styles.barHover)}
                  height={rowHeight}
                  onClick={() => handleClick(item)}
                  role={'listitem'}
                  style={{
                    cursor: onValueChange || showTooltip ? 'pointer' : 'default',
                    opacity: activeKey && !isActive ? 0.55 : 1,
                  }}
                >
                  <div className={styles.barTrack}>
                    <div
                      className={cx(`${prefixCls}-benchmark-ranking-bar`, styles.bar)}
                      style={{
                        background: barColor,
                        height: barSize,
                        transition: showAnimation ? undefined : 'none',
                        width: `${percent}%`,
                      }}
                    />
                    {errorPct > 0 ? (
                      <div
                        className={styles.errorBar}
                        data-testid="benchmark-error-bar"
                        style={{
                          left: `${errorLeft}%`,
                          width: `${errorWidth}%`,
                        }}
                      />
                    ) : null}
                  </div>
                </Flexbox>,
                `plot-${item.key}`,
              );
            })}
          </Flexbox>

          {showXAxis ? (
            <div className={styles.xAxis}>
              <div className={styles.xAxisLine} />
              <div className={styles.xAxisTicks}>
                {axisTicks.map((tick) => (
                  <span
                    className={styles.xAxisTick}
                    key={tick}
                    style={{
                      left: `${toPercent(tick)}%`,
                      transform:
                        tick === 0
                          ? 'translateX(0)'
                          : tick === resolvedMaxValue
                            ? 'translateX(-100%)'
                            : 'translateX(-50%)',
                    }}
                  >
                    {displayFormatter(tick)}
                  </span>
                ))}
              </div>
              {xAxisLabel ? <div className={styles.xAxisLabel}>{xAxisLabel}</div> : null}
            </div>
          ) : null}
        </div>

        {showValueLabel ? (
          <Flexbox className={styles.scoreColumn} gap={8}>
            {items.map((item) => {
              const textColor = item.highlighted ? resolvedHighlightColor : undefined;
              const display = formatBenchmarkAccuracyDisplay({
                accuracyFormatter,
                error: item.error,
                errorFormatter,
                showError: showError && !enableErrorBars,
                value: item.value,
                valueFormatter,
              });

              return renderRowTooltip(
                item,
                <Flexbox
                  align="center"
                  className={styles.scoreRow}
                  height={rowHeight}
                  horizontal
                  justify="flex-end"
                  onClick={() => handleClick(item)}
                  style={{ cursor: onValueChange || showTooltip ? 'pointer' : 'default' }}
                >
                  <div
                    className={styles.score}
                    style={textColor ? { color: textColor } : undefined}
                  >
                    {displayFormatter(item.value)}
                    {display.errorText ? (
                      <span className={styles.scoreError}>± {display.errorText}</span>
                    ) : null}
                  </div>
                </Flexbox>,
                `score-${item.key}`,
              );
            })}
            {showXAxis ? (
              <div className={styles.axisLabelSpacer} style={{ minHeight: xAxisLabel ? 44 : 28 }} />
            ) : null}
          </Flexbox>
        ) : null}

        {!data.length && <NoData noDataText={noDataText} />}
      </Flexbox>
    );
  },
);

BenchmarkRankingChart.displayName = 'BenchmarkRankingChart';

export default BenchmarkRankingChart;
