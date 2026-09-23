'use client';

import { A, Skeleton } from '@lobehub/ui';
import { useSize } from 'ahooks';
import { Segmented, Tooltip } from 'antd';
import { cssVar, cx, useTheme } from 'antd-style';
import { type CSSProperties, type ReactNode, forwardRef, useMemo, useRef, useState } from 'react';

import ChartTooltip from '@/common/ChartTooltip';
import NoData from '@/common/NoData';
import {
  type BenchmarkBaseProps,
  type BenchmarkEventProps,
  type BenchmarkPointShape,
  type NormalizedBenchmarkItem,
  defaultBenchmarkErrorFormatter,
  defaultBenchmarkValueFormatter,
  normalizeBenchmarkData,
} from '@/common/benchmark';
import { constructCategoryColors } from '@/common/utils';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import { getTextWidth } from '@/utils/getMaxLabelLength';

import { styles } from './styles';
import {
  type Box,
  type LabelCandidate,
  type PlacedLabel,
  type ScaleType,
  createScale,
  getParetoFrontier,
  placeLabels,
} from './utils';

export interface BenchmarkScatterMetric {
  /**
   * Axis title; falls back to `label`
   */
  axisLabel?: string;
  /**
   * Which direction is better on this axis (drives the Pareto frontier)
   * @default 'lower'
   */
  direction?: 'lower' | 'higher';
  formatter?: (value: number) => string;
  /**
   * Record field holding this metric
   */
  key: string;
  /**
   * Label shown in the metric switcher and tooltip
   */
  label: string;
  max?: number;
  min?: number;
  /**
   * @default 'linear'
   */
  scale?: ScaleType;
}

export interface BenchmarkScatterChartProps extends Omit<BenchmarkBaseProps, 'sortOrder'> {
  /**
   * Initially selected metric key when `metrics` is provided (uncontrolled)
   */
  defaultMetric?: string;
  /**
   * Pareto frontier line color
   * @default theme.orange
   */
  frontierColor?: string;
  /**
   * @default 2
   */
  frontierWidth?: number;
  /**
   * Size of consumer-provided icons; should match the size the icon renders at.
   * Icons are scaled down from this size in the legend.
   * @default 20
   */
  iconSize?: number;
  /**
   * Font size for the point name label
   * @default 12
   */
  labelFontSize?: number;
  /**
   * Size of the fallback shape marker when an item has no icon
   * @default 12
   */
  markerSize?: number;
  maxX?: number;
  maxY?: number;
  /**
   * Selected metric key (controlled)
   */
  metric?: string;
  /**
   * Switchable X metrics (e.g. Cost / Speed). Overrides `xKey`, `xScale`,
   * `xFormatter`, `xAxisLabel` and `xDirection` for the active metric.
   */
  metrics?: BenchmarkScatterMetric[];
  minX?: number;
  minY?: number;
  onMetricChange?: (metric: string) => void;
  /**
   * On hover, shade the region the point dominates (worse X and lower Y)
   * and gray out the points inside it. When off, all other points are dimmed instead.
   * @default true
   */
  showDominatedArea?: boolean;
  /**
   * Draw vertical error bars when records have `error`
   * @default true
   */
  showErrorBars?: boolean;
  /**
   * Connect non-dominated points with a Pareto frontier line
   * @default true
   */
  showFrontier?: boolean;
  /**
   * @default true
   */
  showGridLines?: boolean;
  /**
   * Show name labels next to points (placed automatically to avoid overlap)
   * @default true
   */
  showLabels?: boolean;
  /**
   * @default true
   */
  showLegend?: boolean;
  /**
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Show `y · x` values under each point label
   * @default true
   */
  showValueLabel?: boolean;
  /**
   * @default true
   */
  showXAxis?: boolean;
  /**
   * @default true
   */
  showYAxis?: boolean;
  /**
   * Font size for the `y · x` value line
   * @default 11
   */
  valueLabelFontSize?: number;
  xAxisLabel?: string;
  /**
   * Which direction is better on X (drives the Pareto frontier)
   * @default 'lower'
   */
  xDirection?: 'lower' | 'higher';
  xFormatter?: (value: number) => string;
  /**
   * Record field used for the X axis
   * @default 'x'
   */
  xKey?: string;
  /**
   * X axis scale
   * @default 'linear'
   */
  xScale?: ScaleType;
  yAxisLabel?: string;
}

interface PlotPoint {
  color: string;
  item: NormalizedBenchmarkItem;
  key: string | number;
  x: number;
  y: number;
}

const labelPriority = (point: PlotPoint, frontierKeys: ReadonlySet<string | number>) =>
  (frontierKeys.has(point.key) ? 0 : 2) + (point.item.highlighted ? 0 : 1);

const MARGIN_TOP = 12;
const MARGIN_RIGHT = 16;
const TICK_GAP = 8;
const AXIS_TITLE_SIZE = 22;
// Monospace glyph advance relative to font size (Geist Mono / SF Mono ≈ 0.6em)
const MONO_CHAR_RATIO = 0.62;

const renderShape = (
  shape: BenchmarkPointShape | undefined,
  color: string,
  size: number,
  ring = false,
) => {
  const half = size / 2;
  let node: ReactNode;
  switch (shape) {
    case 'square': {
      node = (
        <rect
          fill={color}
          height={size * 0.84}
          width={size * 0.84}
          x={size * 0.08}
          y={size * 0.08}
        />
      );
      break;
    }
    case 'diamond': {
      node = <path d={`M${half},0 L${size},${half} L${half},${size} L0,${half} Z`} fill={color} />;
      break;
    }
    case 'triangle': {
      node = <path d={`M${half},0 L${size},${size * 0.9} L0,${size * 0.9} Z`} fill={color} />;
      break;
    }
    default: {
      node = <circle cx={half} cy={half} fill={color} r={half} />;
    }
  }
  return (
    <svg height={size} style={{ display: 'block', overflow: 'visible' }} width={size}>
      {ring ? (
        <g paintOrder="stroke" stroke={cssVar.colorBgContainer} strokeWidth={4}>
          {node}
        </g>
      ) : (
        node
      )}
    </svg>
  );
};

const toLabelText = (name: ReactNode) => String(name ?? '').replaceAll('\n', ' ');

const BenchmarkScatterChart = forwardRef<HTMLDivElement, BenchmarkScatterChartProps>(
  (props, ref) => {
    const theme = useTheme();
    const themeColorRange = useThemeColorRange();
    const {
      data = [],
      index,
      valueKey,
      providerKey,
      iconKey,
      colorKey,
      errorKey,
      renderIcon,
      valueFormatter = defaultBenchmarkValueFormatter,
      accuracyFormatter,
      errorFormatter = defaultBenchmarkErrorFormatter,
      showError = true,
      showErrorBars = true,
      showAnimation = false,
      onValueChange,
      className,
      style,
      loading,
      width = '100%',
      height = 420,
      noDataText,
      highlightColor,
      frontierColor,
      frontierWidth = 2,
      iconSize = 20,
      markerSize = 12,
      labelFontSize = 12,
      valueLabelFontSize = 11,
      metrics,
      metric,
      defaultMetric,
      onMetricChange,
      minX,
      maxX,
      minY,
      maxY,
      showDominatedArea = true,
      showFrontier = true,
      showGridLines = true,
      showLabels = true,
      showLegend = true,
      showTooltip = true,
      showValueLabel = true,
      showXAxis = true,
      showYAxis = true,
      xAxisLabel,
      xDirection = 'lower',
      xFormatter = defaultBenchmarkValueFormatter,
      xKey = 'x',
      xScale = 'linear',
      yAxisLabel,
      ...rest
    } = props;

    const plotRef = useRef<HTMLDivElement>(null);
    const size = useSize(plotRef);
    const [innerMetric, setInnerMetric] = useState(defaultMetric);
    const [hoverKey, setHoverKey] = useState<string | number | undefined>();
    const [selectedKey, setSelectedKey] = useState<string | number | undefined>();

    const resolvedHighlightColor = highlightColor ?? theme.gold;
    const resolvedFrontierColor = frontierColor ?? theme.orange;
    const yFormatter = accuracyFormatter ?? valueFormatter;
    const yName = yAxisLabel || (accuracyFormatter ? 'Accuracy' : 'Score');

    const activeMetric = useMemo(() => {
      if (metrics?.length) {
        const key = metric ?? innerMetric;
        const found = metrics.find((m) => m.key === key) ?? metrics[0];
        return {
          axisLabel: found.axisLabel ?? found.label,
          direction: found.direction ?? 'lower',
          formatter: found.formatter ?? defaultBenchmarkValueFormatter,
          key: found.key,
          label: found.label,
          max: found.max ?? maxX,
          min: found.min ?? minX,
          scale: found.scale ?? 'linear',
        };
      }
      return {
        axisLabel: xAxisLabel,
        direction: xDirection,
        formatter: xFormatter,
        key: xKey,
        label: xAxisLabel || 'X',
        max: maxX,
        min: minX,
        scale: xScale,
      };
    }, [
      innerMetric,
      maxX,
      metric,
      metrics,
      minX,
      xAxisLabel,
      xDirection,
      xFormatter,
      xKey,
      xScale,
    ]);

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
          sortOrder: 'descending',
          valueKey,
        }),
      [colorKey, data, errorKey, iconKey, index, providerKey, renderIcon, valueKey],
    );

    const categoryColors = useMemo(
      () =>
        constructCategoryColors(
          items.map((item) => String(item.key)),
          themeColorRange,
        ),
      [items, themeColorRange],
    );

    const points: PlotPoint[] = useMemo(
      () =>
        items
          .map((item) => ({
            color: item.color ?? categoryColors.get(String(item.key)) ?? cssVar.colorPrimary,
            item,
            key: item.key,
            x: Number(item.original[activeMetric.key]),
            y: item.value,
          }))
          .filter(
            (p) =>
              Number.isFinite(p.x) &&
              Number.isFinite(p.y) &&
              (activeMetric.scale !== 'log' || p.x > 0),
          ),
      [activeMetric.key, activeMetric.scale, categoryColors, items],
    );

    const frontier = useMemo(
      () => (showFrontier ? getParetoFrontier(points, activeMetric.direction) : []),
      [activeMetric.direction, points, showFrontier],
    );
    const frontierKeys = useMemo(() => new Set(frontier.map((p) => p.key)), [frontier]);

    const enableErrorBars = showError && showErrorBars;
    const yValues = useMemo(
      () =>
        points.flatMap((p) =>
          enableErrorBars && p.item.error ? [p.y - p.item.error, p.y + p.item.error] : [p.y],
        ),
      [enableErrorBars, points],
    );

    const labelSizes = useMemo(() => {
      const map = new Map<string | number, { height: number; width: number }>();
      if (!showLabels) return map;
      const nameScale = (labelFontSize / 12) * 1.1;
      for (const p of points) {
        const nameWidth = getTextWidth(toLabelText(p.item.name)) * nameScale;
        const valueWidth = showValueLabel
          ? `${yFormatter(p.y)} · ${activeMetric.formatter(p.x)}`.length *
            valueLabelFontSize *
            MONO_CHAR_RATIO
          : 0;
        map.set(p.key, {
          height: Math.ceil(labelFontSize * 1.3 + (showValueLabel ? valueLabelFontSize * 1.3 : 0)),
          width: Math.ceil(Math.max(nameWidth, valueWidth)) + 2,
        });
      }
      return map;
    }, [
      activeMetric,
      labelFontSize,
      points,
      showLabels,
      showValueLabel,
      valueLabelFontSize,
      yFormatter,
    ]);

    const plotWidth = size?.width || (typeof width === 'number' ? width : 0);
    const plotHeight = typeof height === 'number' ? height : 420;

    const layout = useMemo(() => {
      if (!plotWidth || !points.length) return null;

      const probeY = createScale({ max: maxY, min: minY, range: [0, 1], values: yValues });
      const yTickWidth = showYAxis
        ? Math.max(...probeY.ticks.map((t) => yFormatter(t).length * 12 * MONO_CHAR_RATIO), 0)
        : 0;

      const left = (showYAxis ? yTickWidth + TICK_GAP + 4 : 4) + (yAxisLabel ? AXIS_TITLE_SIZE : 0);
      const bottom = (showXAxis ? 26 : 4) + (activeMetric.axisLabel ? AXIS_TITLE_SIZE : 0);
      const innerRight = plotWidth - MARGIN_RIGHT;
      const innerBottom = plotHeight - bottom;

      const xScaleObj = createScale({
        max: activeMetric.max,
        min: activeMetric.min,
        range: [left, innerRight],
        type: activeMetric.scale,
        values: points.map((p) => p.x),
      });
      const yScaleObj = createScale({
        max: maxY,
        min: minY,
        range: [innerBottom, MARGIN_TOP],
        values: yValues,
      });

      const positions = new Map<string | number, { px: number; py: number; radius: number }>();
      for (const p of points) {
        positions.set(p.key, {
          px: xScaleObj.map(p.x),
          py: yScaleObj.map(p.y),
          radius: (p.item.icon ? iconSize : markerSize) / 2,
        });
      }

      const frontierPath = frontier
        .map((p, i) => {
          const pos = positions.get(p.key)!;
          return `${i === 0 ? 'M' : 'L'}${pos.px.toFixed(2)},${pos.py.toFixed(2)}`;
        })
        .join(' ');

      let labels = new Map<string | number, PlacedLabel>();
      if (showLabels) {
        const lineBoxes: Box[] = [];
        for (let i = 1; i < frontier.length; i++) {
          const a = positions.get(frontier[i - 1].key)!;
          const b = positions.get(frontier[i].key)!;
          const steps = Math.max(1, Math.ceil(Math.hypot(b.px - a.px, b.py - a.py) / 10));
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            lineBoxes.push({
              height: 6,
              width: 6,
              x: a.px + (b.px - a.px) * t - 3,
              y: a.py + (b.py - a.py) * t - 3,
            });
          }
        }

        const ordered = [...points].sort(
          (a, b) => labelPriority(a, frontierKeys) - labelPriority(b, frontierKeys) || b.y - a.y,
        );
        const candidates: LabelCandidate[] = ordered.map((p) => {
          const pos = positions.get(p.key)!;
          const labelSize = labelSizes.get(p.key) ?? { height: 16, width: 40 };
          return { ...labelSize, key: p.key, ...pos };
        });

        labels = placeLabels(
          candidates,
          { height: innerBottom, width: plotWidth - left + MARGIN_RIGHT, x: left, y: 0 },
          { lines: lineBoxes },
        );
      }

      return {
        bottom,
        frontierPath,
        innerBottom,
        innerRight,
        labels,
        left,
        positions,
        xScale: xScaleObj,
        yScale: yScaleObj,
      };
    }, [
      activeMetric,
      frontier,
      frontierKeys,
      iconSize,
      labelSizes,
      markerSize,
      maxY,
      minY,
      plotHeight,
      plotWidth,
      points,
      showLabels,
      showXAxis,
      showYAxis,
      yAxisLabel,
      yFormatter,
      yValues,
    ]);

    if (loading || !data) return <Skeleton.Block active height={plotHeight} width={width} />;

    const focusKey = hoverKey ?? selectedKey;
    const focusPoint =
      focusKey === undefined ? undefined : points.find((point) => point.key === focusKey);
    const dominatedKeys = new Set<string | number>();
    if (showDominatedArea && focusPoint) {
      for (const point of points) {
        if (point.key === focusPoint.key || point.y > focusPoint.y) continue;
        const worseX =
          activeMetric.direction === 'lower' ? point.x >= focusPoint.x : point.x <= focusPoint.x;
        if (worseX) dominatedKeys.add(point.key);
      }
    }
    const getEmphasis = (key: string | number): 'normal' | 'dimmed' | 'dominated' => {
      if (focusKey === undefined || key === focusKey) return 'normal';
      if (!showDominatedArea) return 'dimmed';
      return dominatedKeys.has(key) ? 'dominated' : 'normal';
    };
    const isDimmed = (key: string | number) => getEmphasis(key) !== 'normal';
    const animatedCls = showAnimation ? undefined : styles.noTransition;

    const handleClick = (item: NormalizedBenchmarkItem) => {
      if (!onValueChange) return;
      if (selectedKey === item.key) {
        setSelectedKey(undefined);
        onValueChange(null);
        return;
      }
      setSelectedKey(item.key);
      const payload: BenchmarkEventProps = {
        ...item.original,
        eventType: 'point',
        rank: item.rank,
        value: item.value,
      };
      onValueChange(payload);
    };

    const handleMetricChange = (key: string) => {
      if (metric === undefined) setInnerMetric(key);
      onMetricChange?.(key);
    };

    const renderTooltip = (point: PlotPoint, child: ReactNode) => {
      if (!showTooltip) return child;

      const { item } = point;
      const rows: Array<{ format: (_value: number) => string; name: string; value: number }> = [];
      if (metrics?.length) {
        for (const m of metrics) {
          const value = Number(item.original[m.key]);
          if (!Number.isFinite(value)) continue;
          rows.push({
            format: m.formatter ?? defaultBenchmarkValueFormatter,
            name: m.label,
            value,
          });
        }
      } else {
        rows.push({ format: activeMetric.formatter, name: activeMetric.label, value: point.x });
      }
      rows.reverse();
      rows.push({
        format: (v) =>
          showError && item.error !== undefined
            ? `${yFormatter(v)} ± ${errorFormatter(item.error)}`
            : yFormatter(v),
        name: yName,
        value: point.y,
      });

      const formatters = new Map(rows.map((row) => [row.name, row.format]));
      const modelName = toLabelText(item.name);

      return (
        <Tooltip
          arrow={false}
          mouseEnterDelay={0.05}
          mouseLeaveDelay={0}
          styles={{
            container: {
              background: 'transparent',
              boxShadow: 'none',
              maxWidth: 'none',
              padding: 0,
              pointerEvents: 'none',
              width: 'max-content',
            },
            root: { maxWidth: 'none', pointerEvents: 'none' },
          }}
          title={
            <ChartTooltip
              active
              categoryColors={new Map(rows.map((row) => [row.name, point.color]))}
              label={item.provider ? `${modelName} · ${String(item.provider)}` : modelName}
              payload={rows.map((row) => ({ dataKey: row.name, name: row.name, value: row.value }))}
              valueFormatter={(value: number, name?: string) =>
                (formatters.get(name ?? '') ?? String)(Number(value))
              }
            />
          }
        >
          {child}
        </Tooltip>
      );
    };

    const renderMarker = (point: PlotPoint, markerSizePx: number, ring = false) =>
      point.item.icon ? (
        <span
          className={ring ? styles.markerIconRing : undefined}
          style={{
            alignItems: 'center',
            display: 'flex',
            flexShrink: 0,
            height: iconSize,
            justifyContent: 'center',
            transform: markerSizePx === iconSize ? undefined : `scale(${markerSizePx / iconSize})`,
            width: iconSize,
          }}
        >
          {point.item.icon}
        </span>
      ) : (
        renderShape(point.item.original.shape, point.color, markerSizePx, ring)
      );

    const hasMetricSwitch = (metrics?.length ?? 0) > 1;

    return (
      <div
        className={cx(styles.container, className)}
        ref={ref}
        style={
          {
            '--benchmark-label-font-size': `${labelFontSize}px`,
            '--benchmark-value-label-font-size': `${valueLabelFontSize}px`,
            'width': width,
            ...style,
          } as CSSProperties
        }
        {...rest}
      >
        {(showLegend && points.length > 0) || hasMetricSwitch ? (
          <div className={styles.header}>
            <div className={styles.legend}>
              {showLegend
                ? points.map((point) => (
                    <span
                      className={styles.legendItem}
                      key={`legend-${point.key}`}
                      onClick={() => handleClick(point.item)}
                      onMouseEnter={() => setHoverKey(point.key)}
                      onMouseLeave={() => setHoverKey(undefined)}
                      style={{
                        color: point.item.highlighted ? resolvedHighlightColor : undefined,
                        cursor: onValueChange ? 'pointer' : undefined,
                        opacity: isDimmed(point.key) ? 0.4 : 1,
                      }}
                    >
                      <span className={styles.legendMarker}>{renderMarker(point, 12)}</span>
                      {toLabelText(point.item.name)}
                    </span>
                  ))
                : null}
            </div>
            {hasMetricSwitch ? (
              <Segmented
                onChange={(value) => handleMetricChange(String(value))}
                options={metrics!.map((m) => ({ label: m.label, value: m.key }))}
                size="small"
                value={activeMetric.key}
              />
            ) : null}
          </div>
        ) : null}

        <div className={styles.plot} ref={plotRef} style={{ height: plotHeight }}>
          {!points.length ? <NoData noDataText={noDataText} /> : null}
          {layout ? (
            <>
              <svg
                height={plotHeight}
                role="img"
                style={{ display: 'block', overflow: 'visible' }}
                width={plotWidth}
              >
                {showGridLines ? (
                  <g>
                    {layout.yScale.ticks.map((tick) => {
                      const y = layout.yScale.map(tick);
                      return (
                        <line
                          className={styles.gridLine}
                          key={`gy-${tick}`}
                          x1={layout.left}
                          x2={layout.innerRight}
                          y1={y}
                          y2={y}
                        />
                      );
                    })}
                    {layout.xScale.ticks.map((tick) => {
                      const x = layout.xScale.map(tick);
                      return (
                        <line
                          className={styles.gridLine}
                          key={`gx-${tick}`}
                          x1={x}
                          x2={x}
                          y1={MARGIN_TOP}
                          y2={layout.innerBottom}
                        />
                      );
                    })}
                  </g>
                ) : null}

                {showYAxis ? (
                  <g>
                    {layout.yScale.ticks.map((tick) => (
                      <text
                        className={styles.tickLabel}
                        dominantBaseline="middle"
                        key={`ty-${tick}`}
                        textAnchor="end"
                        x={layout.left - TICK_GAP}
                        y={layout.yScale.map(tick)}
                      >
                        {yFormatter(tick)}
                      </text>
                    ))}
                  </g>
                ) : null}

                {showXAxis ? (
                  <g>
                    <line
                      className={styles.axisLine}
                      x1={layout.left}
                      x2={layout.innerRight}
                      y1={layout.innerBottom}
                      y2={layout.innerBottom}
                    />
                    {layout.xScale.ticks.map((tick) => (
                      <text
                        className={styles.tickLabel}
                        dominantBaseline="hanging"
                        key={`tx-${tick}`}
                        textAnchor="middle"
                        x={layout.xScale.map(tick)}
                        y={layout.innerBottom + TICK_GAP}
                      >
                        {activeMetric.formatter(tick)}
                      </text>
                    ))}
                  </g>
                ) : null}

                {yAxisLabel ? (
                  <text
                    className={styles.axisLabel}
                    dominantBaseline="hanging"
                    textAnchor="middle"
                    transform={`rotate(-90, 0, ${(MARGIN_TOP + layout.innerBottom) / 2})`}
                    x={0}
                    y={(MARGIN_TOP + layout.innerBottom) / 2}
                  >
                    {yAxisLabel}
                  </text>
                ) : null}

                {activeMetric.axisLabel ? (
                  <text
                    className={styles.axisLabel}
                    dominantBaseline="auto"
                    textAnchor="middle"
                    x={(layout.left + layout.innerRight) / 2}
                    y={plotHeight - 4}
                  >
                    {activeMetric.axisLabel}
                  </text>
                ) : null}

                {showDominatedArea && focusPoint
                  ? (() => {
                      const pos = layout.positions.get(focusPoint.key)!;
                      const toRight = activeMetric.direction === 'lower';
                      const x0 = toRight ? pos.px : layout.left;
                      const x1 = toRight ? layout.innerRight : pos.px;
                      return (
                        <g
                          className={styles.dominatedArea}
                          data-testid="benchmark-scatter-dominated-area"
                        >
                          <rect
                            fill={resolvedFrontierColor}
                            fillOpacity={0.08}
                            height={Math.max(0, layout.innerBottom - pos.py)}
                            width={Math.max(0, x1 - x0)}
                            x={x0}
                            y={pos.py}
                          />
                          <line
                            className={styles.dominatedGuide}
                            x1={x0}
                            x2={x1}
                            y1={pos.py}
                            y2={pos.py}
                          />
                          <line
                            className={styles.dominatedGuide}
                            x1={pos.px}
                            x2={pos.px}
                            y1={pos.py}
                            y2={layout.innerBottom}
                          />
                        </g>
                      );
                    })()
                  : null}

                {enableErrorBars
                  ? points.map((point) => {
                      const { error } = point.item;
                      if (!error) return null;
                      const pos = layout.positions.get(point.key)!;
                      const top = layout.yScale.map(point.y + error);
                      const bottom = layout.yScale.map(point.y - error);
                      return (
                        <g
                          className={styles.errorBar}
                          data-testid="benchmark-scatter-error-bar"
                          key={`err-${point.key}`}
                          opacity={isDimmed(point.key) ? 0.25 : 0.7}
                          stroke={point.color}
                        >
                          <line x1={pos.px} x2={pos.px} y1={top} y2={bottom} />
                          <line x1={pos.px - 4} x2={pos.px + 4} y1={top} y2={top} />
                          <line x1={pos.px - 4} x2={pos.px + 4} y1={bottom} y2={bottom} />
                        </g>
                      );
                    })
                  : null}

                {layout.frontierPath ? (
                  <path
                    className={styles.frontier}
                    d={layout.frontierPath}
                    data-testid="benchmark-scatter-frontier"
                    opacity={
                      !showDominatedArea && focusKey !== undefined && !frontierKeys.has(focusKey)
                        ? 0.35
                        : 1
                    }
                    stroke={resolvedFrontierColor}
                    strokeWidth={frontierWidth}
                    style={showAnimation ? { transition: `d 0.4s, opacity 0.2s` } : undefined}
                  />
                ) : null}
              </svg>

              <div className={styles.overlay}>
                {points.map((point) => {
                  const pos = layout.positions.get(point.key)!;
                  const markerPx = point.item.icon ? iconSize : markerSize;
                  return (
                    <div key={`marker-${point.key}`}>
                      {renderTooltip(
                        point,
                        <div
                          aria-label={`${toLabelText(point.item.name)}: ${yFormatter(point.y)}, ${activeMetric.formatter(point.x)}`}
                          className={cx(styles.marker, animatedCls)}
                          onClick={() => handleClick(point.item)}
                          onMouseEnter={() => setHoverKey(point.key)}
                          onMouseLeave={() => setHoverKey(undefined)}
                          role="button"
                          style={{
                            cursor: onValueChange ? 'pointer' : 'default',
                            filter:
                              getEmphasis(point.key) === 'dominated' ? 'grayscale(1)' : undefined,
                            height: markerPx,
                            left: pos.px,
                            opacity: { dimmed: 0.25, dominated: 0.5, normal: 1 }[
                              getEmphasis(point.key)
                            ],
                            top: pos.py,
                            width: markerPx,
                          }}
                        >
                          {renderMarker(point, markerPx, true)}
                        </div>,
                      )}
                    </div>
                  );
                })}

                {showLabels
                  ? points.map((point) => {
                      const label = layout.labels.get(point.key);
                      if (!label) return null;
                      const emphasis = getEmphasis(point.key);
                      const textColor =
                        emphasis === 'dominated'
                          ? cssVar.colorTextQuaternary
                          : point.item.highlighted
                            ? resolvedHighlightColor
                            : undefined;
                      const isKeyLabel =
                        emphasis !== 'dominated' &&
                        (frontierKeys.has(point.key) ||
                          point.item.highlighted ||
                          point.key === focusKey);
                      const align = label.placement.endsWith('left')
                        ? 'right'
                        : label.placement === 'top' || label.placement === 'bottom'
                          ? 'center'
                          : 'left';
                      const name = toLabelText(point.item.name);

                      return (
                        <div
                          className={cx(styles.label, animatedCls)}
                          key={`label-${point.key}`}
                          onClick={() => handleClick(point.item)}
                          onMouseEnter={() => setHoverKey(point.key)}
                          onMouseLeave={() => setHoverKey(undefined)}
                          style={{
                            cursor: onValueChange ? 'pointer' : 'default',
                            height: label.height,
                            left: label.x,
                            opacity: emphasis === 'dimmed' ? 0.25 : 1,
                            textAlign: align,
                            top: label.y,
                            width: label.width,
                          }}
                        >
                          <div
                            className={cx(styles.labelName, isKeyLabel && styles.labelNameEmphasis)}
                            style={textColor ? { color: textColor } : undefined}
                          >
                            {point.item.href ? (
                              <A
                                className={styles.labelNameLink}
                                href={point.item.href}
                                onClick={(event) => event.stopPropagation()}
                                target={point.item.target}
                              >
                                {name}
                              </A>
                            ) : (
                              name
                            )}
                          </div>
                          {showValueLabel ? (
                            <div className={styles.labelValue}>
                              {yFormatter(point.y)} · {activeMetric.formatter(point.x)}
                            </div>
                          ) : null}
                        </div>
                      );
                    })
                  : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  },
);

BenchmarkScatterChart.displayName = 'BenchmarkScatterChart';

export default BenchmarkScatterChart;
