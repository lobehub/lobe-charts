'use client';

import { Skeleton } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useMemo } from 'react';

import {
  A2UI_PALETTE,
  A2uiFloatingTooltip,
  A2uiFrame,
  a2uiPaletteAt,
  a2uiStyles,
  type ChartNumberFormat,
  createValueFormatter,
  measureTextWidth,
  useA2uiHover,
  useElementWidth,
} from '@/common/a2ui';
import type { ValueFormatter } from '@/types/charts';

import { layoutTreemap, type TreemapCell } from './utils';

export interface TreemapChartProps {
  /**
   * Key of the value.
   * @default 'value'
   */
  category?: string;
  className?: string;
  /** Palette, one colour per group (or per item when ungrouped). Defaults to the A2UI palette. */
  colors?: string[];
  /**
   * ISO 4217 code used when `format` is `currency`.
   * @default 'USD'
   */
  currency?: string;
  /** Rows of `{ name, value, group? }`; keys are set by `index`, `category` and `group`. */
  data: any[];
  /** How values read in the tooltip. `percent` expects 0-100. */
  format?: ChartNumberFormat;
  /**
   * Key of the group a row belongs to. Groups share a colour and are laid out together.
   * @default 'group'
   */
  group?: string;
  /**
   * Plot height in px.
   * @default 260
   */
  height?: number;
  /**
   * Key of the item name.
   * @default 'name'
   */
  index?: string;
  loading?: boolean;
  noDataText?: ReactNode;
  ref?: Ref<HTMLElement>;
  /**
   * Show the groups in the header when there are several.
   * @default true
   */
  showLegend?: boolean;
  /**
   * @default true
   */
  showTooltip?: boolean;
  style?: CSSProperties;
  /** Secondary line under the title. */
  subtitle?: string;
  /** Card title. */
  title?: string;
  /** Unit appended to values. */
  unit?: string;
  /** Formats values; wins over `format`. */
  valueFormatter?: ValueFormatter;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const LABEL_SIZE = 11.5;
const LABEL_PADDING = 6;

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `Treemap`.
const TreemapChart = ({
  data = [],
  index = 'name',
  category = 'value',
  group = 'group',
  colors = A2UI_PALETTE,
  format,
  currency = 'USD',
  unit,
  valueFormatter,
  title,
  subtitle,
  height = 260,
  loading,
  noDataText,
  showLegend = true,
  showTooltip = true,
  className,
  style,
  ref,
}: TreemapChartProps) => {
  const [plotRef, width, fontFamily] = useElementWidth();
  const { hover, bind } = useA2uiHover<TreemapCell>();
  const leaves = useMemo(() => {
    const clean = (s: string) => s.replaceAll('|', '/').trim() || 'Other';
    return (data ?? [])
      .filter((d) => typeof d?.[index] === 'string' && isNum(d?.[category]) && d[category] > 0)
      .map((d) => ({
        group: typeof d[group] === 'string' && d[group] ? clean(d[group]) : '',
        name: clean(d[index]),
        value: d[category] as number,
      }));
  }, [data, index, category, group]);
  const { cells, keys, total } = useMemo(
    () => layoutTreemap(leaves, Math.max(0, width), height),
    [leaves, width, height],
  );
  const colorOf = (key: string) => a2uiPaletteAt(Math.max(0, keys.indexOf(key)), colors);
  const formatValue = useMemo(
    () => valueFormatter ?? createValueFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );
  const hasGroups = leaves.some((l) => l.group);
  const font = `600 ${LABEL_SIZE}px ${fontFamily ?? 'sans-serif'}`;

  const fits = (cell: TreemapCell) => {
    const w = measureTextWidth(cell.name, font, LABEL_SIZE);
    return (
      cell.x1 - cell.x0 - LABEL_PADDING * 2 >= w &&
      cell.y1 - cell.y0 - LABEL_PADDING * 2 >= LABEL_SIZE * 1.2
    );
  };

  const hovered = hover?.datum;

  return (
    <A2uiFrame
      className={className}
      empty={!loading && leaves.length === 0}
      emptyText={noDataText}
      ref={ref}
      style={style}
      subtitle={subtitle}
      title={title}
      legend={
        showLegend && hasGroups ? keys.map((k) => ({ color: colorOf(k), label: k })) : undefined
      }
    >
      <div className={a2uiStyles.plot} ref={plotRef} style={{ height }}>
        {loading ? (
          <Skeleton height={height} width={'100%'} />
        ) : width > 0 ? (
          <svg
            aria-label={title ?? 'Treemap'}
            height={height}
            role="img"
            style={{ display: 'block' }}
            width={width}
          >
            {cells.map((cell) => {
              const key = cell.group || cell.name;
              const active = hovered === cell;
              const w = cell.x1 - cell.x0;
              const h = cell.y1 - cell.y0;
              if (w <= 0 || h <= 0) return null;
              return (
                <g key={`${cell.group}\u0000${cell.name}`} {...(showTooltip ? bind(cell) : {})}>
                  <rect
                    fill={colorOf(key)}
                    fillOpacity={active ? 1 : 0.88}
                    height={h}
                    rx={Math.min(6, w / 2, h / 2)}
                    stroke={active ? 'var(--a2-chart-focus)' : undefined}
                    strokeWidth={active ? 1.5 : undefined}
                    width={w}
                    x={cell.x0}
                    y={cell.y0}
                  />
                  {fits(cell) ? (
                    <text
                      dominantBaseline="middle"
                      fill="var(--a2-treemap-ink)"
                      fontSize={LABEL_SIZE}
                      fontWeight={600}
                      pointerEvents="none"
                      textAnchor="middle"
                      x={cell.x0 + w / 2}
                      y={cell.y0 + h / 2}
                    >
                      {cell.name}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        ) : null}
        {showTooltip && hovered ? (
          <A2uiFloatingTooltip
            height={height}
            title={hovered.name}
            width={width}
            x={(hovered.x0 + hovered.x1) / 2}
            y={(hovered.y0 + hovered.y1) / 2}
            rows={[
              ...(hovered.group
                ? [{ color: colorOf(hovered.group), label: 'Group', value: hovered.group }]
                : []),
              {
                color: hovered.group ? undefined : colorOf(hovered.name),
                label: 'Value',
                value: formatValue(hovered.value),
              },
              { label: 'Share', value: `${((hovered.value / (total || 1)) * 100).toFixed(1)}%` },
            ]}
          />
        ) : null}
      </div>
    </A2uiFrame>
  );
};

TreemapChart.displayName = 'TreemapChart';

export default TreemapChart;
