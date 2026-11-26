'use client';

import { createStaticStyles, cssVar, cx, Flexbox, Text } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';

import ChartTooltipFrame from '@/common/ChartTooltip/ChartTooltipFrame';
import ChartTooltipRow from '@/common/ChartTooltip/ChartTooltipRow';
import NoData from '@/common/NoData';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';
import Legend from '@/Legend';

import A2uiFrame from './Frame';
import type { ChartFrameLegendItem } from './Legend';
import { styles as a2uiStyles } from './styles';
import { A2UI_GRID, A2UI_TICK, a2uiPaletteAt } from './tokens';
import A2uiTooltip, { type A2uiTooltipRow } from './Tooltip';
import type { ChartVariant } from './types';
import { useA2uiThemeClass } from './useA2uiTheme';

/** Axis paint and spacing per variant: a2ui follows the official charts, default the other lobe charts. */
export interface ChartLook {
  /** Grid line paint. */
  grid: { stroke: string; strokeDasharray?: string };
  /** Tick label paint, spread onto `<text>`. */
  tick: { fill: string; fillOpacity?: number; fontSize: number };
  variant: ChartVariant;
  /** Distance from the plot bottom to an x tick baseline. */
  xBaseline: number;
  /** Where y tick labels sit: right-aligned next to the plot (a2ui) or left-aligned at the edge (default). */
  yAlign: 'plot' | 'edge';
}

export const A2UI_LOOK: ChartLook = {
  grid: A2UI_GRID,
  tick: A2UI_TICK,
  variant: 'a2ui',
  xBaseline: 16.8,
  yAlign: 'plot',
};

export const DEFAULT_LOOK: ChartLook = {
  grid: { stroke: cssVar.colorBorderSecondary },
  tick: { fill: cssVar.colorTextDescription, fontSize: 12 },
  variant: 'default',
  xBaseline: 18,
  yAlign: 'edge',
};

export const lookOf = (variant?: ChartVariant) => (variant === 'a2ui' ? A2UI_LOOK : DEFAULT_LOOK);

const styles = createStaticStyles(({ css }) => ({
  plain: css`
    position: relative;
    width: 100%;
    min-width: 0;
  `,
  tooltipHeader: css`
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
    font-weight: 500;
  `,
}));

export interface ChartShellProps {
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
  empty?: boolean;
  emptyText?: ReactNode;
  footer?: ReactNode;
  legend?: ChartFrameLegendItem[];
  ref?: Ref<HTMLElement>;
  style?: CSSProperties;
  subtitle?: ReactNode;
  title?: ReactNode;
  variant?: ChartVariant;
}

/**
 * The outer chrome of a chart. `a2ui`: the official card with title, subtitle and header legend.
 * `default`: no card, the legend (or `aside`) right-aligned above the plot, like the other lobe charts.
 */
export const ChartShell = ({
  variant = 'default',
  title,
  subtitle,
  legend,
  aside,
  footer,
  children,
  className,
  style,
  empty,
  emptyText,
  ref,
}: ChartShellProps) => {
  const varsClass = useA2uiThemeClass();
  const palette = useThemeColorRange();
  if (variant === 'a2ui')
    return (
      <A2uiFrame
        aside={aside}
        className={className}
        empty={empty}
        emptyText={emptyText}
        legend={legend}
        ref={ref}
        style={style}
        subtitle={subtitle}
        title={title}
      >
        {children}
      </A2uiFrame>
    );
  const items = (legend ?? []).map((it) => (typeof it === 'string' ? { label: it } : it));
  const top =
    aside ??
    (items.length > 1 ? (
      <Legend
        categories={items.map((it) => it.label)}
        colors={items.map((it, i) => it.color ?? a2uiPaletteAt(i, palette))}
      />
    ) : null);
  return (
    <Flexbox
      className={cx(varsClass, styles.plain, className)}
      gap={12}
      ref={ref as Ref<HTMLDivElement>}
      style={style}
    >
      {top ? (
        <Flexbox horizontal align={'center'} justify={'flex-end'}>
          {top}
        </Flexbox>
      ) : null}
      {empty ? (
        <div style={{ height: 160 }}>
          <NoData
            noDataText={
              typeof emptyText === 'string' || typeof emptyText === 'number' ? (
                <span>{emptyText}</span>
              ) : (
                (emptyText as any)
              )
            }
          />
        </div>
      ) : (
        children
      )}
      {footer && !empty ? footer : null}
    </Flexbox>
  );
};

export interface ChartTooltipContentProps {
  rows: A2uiTooltipRow[];
  title?: ReactNode;
  variant?: ChartVariant;
}

/** Tooltip body per variant: the official chrome (a2ui) or the default `ChartTooltip` frame. */
export const ChartTooltipContent = ({
  variant = 'default',
  title,
  rows,
}: ChartTooltipContentProps) => {
  if (variant === 'a2ui') return <A2uiTooltip rows={rows} title={title} />;
  return (
    <ChartTooltipFrame>
      {title !== undefined && title !== null && title !== '' ? (
        <Flexbox
          className={styles.tooltipHeader}
          paddingBlock={8}
          paddingInline={16}
          width={'auto'}
        >
          <Text ellipsis style={{ margin: 0 }}>
            {title}
          </Text>
        </Flexbox>
      ) : null}
      <Flexbox gap={4} paddingBlock={8} paddingInline={16} width={'auto'}>
        {rows.map((row, i) => (
          <ChartTooltipRow
            color={row.color ?? cssVar.colorTextQuaternary}
            key={i}
            name={String(row.label)}
            value={String(row.value)}
          />
        ))}
      </Flexbox>
    </ChartTooltipFrame>
  );
};

/** Class carrying the plot's own layout, shared by both variants. */
export const plotClass = a2uiStyles.plot;
