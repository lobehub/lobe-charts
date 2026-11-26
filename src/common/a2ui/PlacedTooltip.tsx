import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

export interface A2uiPlacedTooltipProps {
  children: ReactNode;
  /** Plot height, to keep the tooltip inside. */
  height: number;
  /**
   * Preferred side: `top` (then bottom, then the sides), or `side` (right, then left) as for points.
   * @default 'top'
   */
  prefer?: 'top' | 'side';
  /** Plot width, to keep the tooltip inside. */
  width: number;
  /** Focused point, in plot coordinates. */
  x: number;
  y: number;
}

const GAP = 10;
/** Room kept between the tooltip and the plot's top and bottom edges. */
const EDGE = 8;

/**
 * Places a tooltip like the official charts: centred above the focused point when it fits, else below
 * it, else to its right (or left); always clamped inside the plot.
 */
const A2uiPlacedTooltip = ({
  x,
  y,
  width,
  height,
  prefer = 'top',
  children,
}: A2uiPlacedTooltipProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ h: number; w: number } | undefined>();

  // Re-measure when the content (rows, values) changes with the focused point.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width: w, height: h } = el.getBoundingClientRect();
    if (!size || Math.abs(size.w - w) > 0.5 || Math.abs(size.h - h) > 0.5) setSize({ h, w });
  }, [children, size]);

  let left = x;
  let top = y;
  if (size) {
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const centred = clamp(x - size.w / 2, 0, Math.max(0, width - size.w));
    const side = () => {
      left = x + GAP + size.w <= width ? x + GAP : Math.max(0, x - GAP - size.w);
      top = clamp(y - size.h / 2, 0, Math.max(0, height - size.h));
    };
    if (prefer === 'side') side();
    else if (y - GAP - size.h >= EDGE) {
      left = centred;
      top = y - GAP - size.h;
    } else if (y + GAP + size.h <= height - EDGE) {
      left = centred;
      top = y + GAP;
    } else side();
  }

  return (
    <div
      ref={ref}
      style={{
        left,
        pointerEvents: 'none',
        position: 'absolute',
        top,
        visibility: size ? 'visible' : 'hidden',
        whiteSpace: 'nowrap',
        width: 'max-content',
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
};

export default A2uiPlacedTooltip;
