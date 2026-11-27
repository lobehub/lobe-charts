import { cssVar, cx } from '@lobehub/ui';
import { Star } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';

import { a2uiStyles } from '@/common/a2ui';
import type { ChartVariant } from '@/common/a2ui/types';
import { useA2uiThemeClass } from '@/common/a2ui/useA2uiTheme';
import { useThemeColorRange } from '@/hooks/useThemeColorRange';

import { cardStyles as styles } from './cardStyles';

/** Accent of a map component: `color`, else the first colour of the theme colour range. */
export const useMapAccent = (color?: string) => {
  const palette = useThemeColorRange();
  const accent = color ?? palette[0];
  // Icon / text ink on a 15% tint of the accent: mixed toward the text colour, so it deepens in light mode
  // and lightens in dark mode.
  const ink = `color-mix(in srgb, ${accent} 78%, ${cssVar.colorText})`;
  return { accent, ink };
};

export interface MapCardProps {
  accent: string;
  accentInk: string;
  children?: ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: CSSProperties;
  variant: ChartVariant;
}

/** Root of every map component: the A2UI card or the plain outlined block. */
export const MapCard = ({
  variant,
  accent,
  accentInk,
  className,
  style,
  children,
  ref,
}: MapCardProps) => {
  const themeClass = useA2uiThemeClass();
  const vars = useMemo(
    () => ({ '--map-accent': accent, '--map-accent-ink': accentInk, ...style }) as CSSProperties,
    [accent, accentInk, style],
  );
  return (
    <div
      data-variant={variant}
      ref={ref}
      style={vars}
      className={cx(
        themeClass,
        variant === 'a2ui' ? cx(a2uiStyles.card, styles.a2ui) : styles.plain,
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MapHeader = ({
  icon,
  title,
  meta,
}: {
  icon: ReactNode;
  meta?: ReactNode;
  title?: ReactNode;
}) => (
  <div className={styles.header}>
    <div className={styles.headerLead}>
      <span className={styles.headerIcon}>{icon}</span>
      <span className={styles.headerTitle}>{title}</span>
    </div>
    {meta ? <div className={styles.headerMeta}>{meta}</div> : null}
  </div>
);

export const NumberDot = ({ n, active }: { active?: boolean; n: number }) => (
  <span className={cx(styles.numberDot, active && styles.numberDotActive)}>{n}</span>
);

export const Rating = ({ value }: { value?: number }) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return (
    <span className={styles.rating}>
      <Star fill="currentColor" size={12} strokeWidth={2} />
      {value.toFixed(1)}
    </span>
  );
};

/** Clamps a requested map height to 160-640 px. */
export const clampHeight = (h: unknown, fallback: number) =>
  typeof h === 'number' && Number.isFinite(h) ? Math.min(Math.max(h, 160), 640) : fallback;
