import type { MouseEvent } from 'react';
import { useCallback, useState } from 'react';

import A2uiPlacedTooltip from './PlacedTooltip';
import A2uiTooltip, { type A2uiTooltipProps } from './Tooltip';

export interface A2uiHoverState<T = unknown> {
  datum: T;
  x: number;
  y: number;
}

/** Hover state for plain-SVG charts: pointer position inside the plot plus the hovered datum. */
export const useA2uiHover = <T,>() => {
  const [hover, setHover] = useState<A2uiHoverState<T> | undefined>();
  const bind = useCallback(
    (datum: T) => ({
      onMouseLeave: () => setHover(undefined),
      onMouseMove: (e: MouseEvent<SVGElement>) => {
        const svg =
          (e.currentTarget as SVGElement).ownerSVGElement ?? (e.currentTarget as SVGSVGElement);
        const rect = svg.getBoundingClientRect();
        setHover({ datum, x: e.clientX - rect.left, y: e.clientY - rect.top });
      },
    }),
    [],
  );
  return { bind, clear: () => setHover(undefined), hover, setHover };
};

export interface A2uiFloatingTooltipProps extends A2uiTooltipProps {
  /** Plot height, used to keep the tooltip inside. */
  height: number;
  /** Plot width, used to keep the tooltip inside. */
  width: number;
  /** Focused point in plot coordinates. */
  x: number;
  y: number;
}

/** The a2ui tooltip placed at a focus point inside a `position: relative` plot. */
export const A2uiFloatingTooltip = ({ x, y, width, height, ...rest }: A2uiFloatingTooltipProps) => (
  <A2uiPlacedTooltip height={height} width={width} x={x} y={y}>
    <A2uiTooltip {...rest} />
  </A2uiPlacedTooltip>
);
