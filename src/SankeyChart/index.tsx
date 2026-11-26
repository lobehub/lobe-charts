'use client';

import { Skeleton } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useMemo } from 'react';

import {
  A2uiFloatingTooltip,
  a2uiPaletteAt,
  a2uiStyles,
  type ChartNumberFormat,
  ChartShell,
  type ChartVariant,
  createValueFormatter,
  formatNumber,
  shortLabel,
  useA2uiHover,
  useElementWidth,
} from '@/common/a2ui';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import type { ValueFormatter } from '@/types/charts';

import { layoutSankey, prepareSankey, ribbonPath, type SankeyLink, type SankeyNode } from './utils';

export interface SankeyChartProps {
  className?: string;
  /** Palette, one colour per node in first-seen order. Defaults to the theme colour range. */
  colors?: string[];
  /**
   * ISO 4217 code used when `format` is `currency`.
   * @default 'USD'
   */
  currency?: string;
  /** Links as rows of `{ source, target, value }`. Nodes are the names they mention. */
  data: any[];
  /** How values read in labels and the tooltip. `percent` expects 0-100. */
  format?: ChartNumberFormat;
  /**
   * Plot height in px.
   * @default 280
   */
  height?: number;
  loading?: boolean;
  noDataText?: ReactNode;
  /**
   * Vertical gap between nodes in px. Defaults to 5% of the height, at least 10px.
   */
  nodePadding?: number;
  /**
   * Width of a node bar in px.
   * @default 10
   */
  nodeWidth?: number;
  ref?: Ref<HTMLElement>;
  /**
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Print the value after each node name.
   * @default true
   */
  showValues?: boolean;
  /**
   * Key of the link source.
   * @default 'source'
   */
  source?: string;
  style?: CSSProperties;
  /** Secondary line under the title (a2ui only). */
  subtitle?: string;
  /**
   * Key of the link target.
   * @default 'target'
   */
  target?: string;
  /** Card title (a2ui only). */
  title?: string;
  /** Unit appended to values. */
  unit?: string;
  /**
   * Key of the link value.
   * @default 'value'
   */
  value?: string;
  /** Formats values; wins over `format`. */
  valueFormatter?: ValueFormatter;
  /**
   * Visual style: `default` sits with the other lobe charts; `a2ui` draws the A2UI card.
   * @default 'default'
   */
  variant?: ChartVariant;
}

const INSET = { bottom: 6, left: 2, right: 2, top: 6 };
const LABEL_GAP = 7;

type Hovered = { kind: 'link'; link: SankeyLink } | { kind: 'node'; node: SankeyNode };

// Adapted from CopilotKit a2ui-playground (MIT): charts.tsx `SankeyChart`.
const SankeyChart = ({
  data = [],
  source = 'source',
  target = 'target',
  value = 'value',
  colors: colorsProp,
  format,
  currency = 'USD',
  unit,
  valueFormatter,
  title,
  subtitle,
  height = 280,
  nodeWidth = 10,
  nodePadding,
  loading,
  noDataText,
  showValues = true,
  showTooltip = true,
  variant = 'default',
  className,
  style,
  ref,
}: SankeyChartProps) => {
  const themeColors = useThemeColorRange();
  const colors = colorsProp ?? themeColors;
  const a2ui = variant === 'a2ui';
  const [plotRef, width] = useElementWidth();
  const { hover, bind } = useA2uiHover<Hovered>();
  const graph = useMemo(
    () => prepareSankey(data, source, target, value),
    [data, source, target, value],
  );
  const layout = useMemo(() => {
    if (width <= 0 || graph.links.length === 0) return { links: [], nodes: [] };
    try {
      return layoutSankey(graph.ids, graph.links, {
        nodePadding: nodePadding ?? Math.max(10, height * 0.05),
        nodeWidth,
        x0: INSET.left,
        x1: width - INSET.right,
        y0: INSET.top,
        y1: height - INSET.bottom,
      });
    } catch {
      return { links: [], nodes: [] };
    }
  }, [graph, width, height, nodeWidth, nodePadding]);

  const colorOf = (id: string) => a2uiPaletteAt(Math.max(0, graph.ids.indexOf(id)), colors);
  const formatValue = useMemo(
    () => valueFormatter ?? createValueFormatter({ currency, format, unit }),
    [valueFormatter, currency, format, unit],
  );
  const formatLabel = (v: number) =>
    valueFormatter
      ? valueFormatter(v)
      : formatNumber(
          v,
          format === 'currency' ? 'currency' : 'compact',
          format === 'currency' ? undefined : unit,
          currency,
        );

  const lastLayer = Math.max(0, ...layout.nodes.map((n) => n.layer));
  const flip = (n: SankeyNode) => n.layer === lastLayer && n.layer > 0;
  const hovered = hover?.datum;
  const isActiveLink = (l: SankeyLink) =>
    !hovered ||
    (hovered.kind === 'link'
      ? hovered.link === l
      : hovered.node === l.source || hovered.node === l.target);

  return (
    <ChartShell
      className={className}
      empty={!loading && graph.links.length === 0}
      emptyText={noDataText}
      ref={ref}
      style={style}
      subtitle={subtitle}
      title={title}
      variant={variant}
    >
      <div className={a2uiStyles.plot} ref={plotRef} style={{ height }}>
        {loading ? (
          <Skeleton height={height} width={'100%'} />
        ) : width > 0 ? (
          <svg
            aria-label={title ?? 'Sankey chart'}
            height={height}
            role="img"
            style={{ display: 'block', overflow: 'visible' }}
            width={width}
          >
            <g fill="none">
              {layout.links.map((l) => (
                <path
                  d={ribbonPath(l.source.x1, l.y0, l.target.x0, l.y1)}
                  key={`${l.source.id}\u0000${l.target.id}`}
                  stroke={colorOf(l.source.id)}
                  strokeLinecap="butt"
                  strokeOpacity={isActiveLink(l) ? (hovered ? 0.45 : 0.28) : 0.12}
                  strokeWidth={Math.max(1, l.width)}
                  {...(showTooltip ? bind({ kind: 'link', link: l }) : {})}
                />
              ))}
            </g>
            {layout.nodes.map((n) => (
              <rect
                fill={colorOf(n.id)}
                height={Math.max(0, n.y1 - n.y0)}
                key={n.id}
                rx={2.5}
                width={n.x1 - n.x0}
                x={n.x0}
                y={n.y0}
                {...(showTooltip ? bind({ kind: 'node', node: n }) : {})}
              />
            ))}
            {layout.nodes.map((n) => (
              <text
                dominantBaseline="middle"
                fill={a2ui ? 'var(--a2-chart-name)' : 'var(--a2-fg)'}
                fontSize={a2ui ? 11 : 12}
                fontWeight={a2ui ? 550 : 500}
                key={`label-${n.id}`}
                pointerEvents="none"
                textAnchor={flip(n) ? 'end' : 'start'}
                x={flip(n) ? Math.min(n.x0, width) - LABEL_GAP : n.x1 + LABEL_GAP}
                y={(n.y0 + n.y1) / 2}
              >
                {shortLabel(n.id, 22)}
                {showValues ? `  ${formatLabel(n.value)}` : ''}
              </text>
            ))}
          </svg>
        ) : null}
        {showTooltip && hover && hovered ? (
          <A2uiFloatingTooltip
            height={height}
            variant={variant}
            width={width}
            x={hover.x}
            y={hover.y}
            rows={
              hovered.kind === 'link'
                ? [
                    {
                      color: colorOf(hovered.link.source.id),
                      label: `${hovered.link.source.id} → ${hovered.link.target.id}`,
                      value: formatValue(hovered.link.value),
                    },
                  ]
                : [
                    {
                      color: colorOf(hovered.node.id),
                      label: hovered.node.id,
                      value: formatValue(hovered.node.value),
                    },
                  ]
            }
          />
        ) : null}
      </div>
    </ChartShell>
  );
};

SankeyChart.displayName = 'SankeyChart';

export default SankeyChart;
