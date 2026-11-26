import { useCallback, useLayoutEffect, useState } from 'react';

/** Fallback used where layout is unavailable (SSR, jsdom), so the chart still renders its marks. */
const FALLBACK_WIDTH = 600;

const canObserve = () => typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined';

/**
 * Tracks the content width of an element and the font family it renders with (for text measurement).
 * Returns a callback ref, so the observer follows the element when it is remounted (e.g. on a variant
 * switch that changes its parent).
 */
export const useElementWidth = <T extends HTMLElement = HTMLDivElement>() => {
  const [el, setEl] = useState<T | null>(null);
  const [width, setWidth] = useState(() => (canObserve() ? 0 : FALLBACK_WIDTH));
  const [fontFamily, setFontFamily] = useState<string | undefined>();
  const ref = useCallback((node: T | null) => setEl(node), []);

  useLayoutEffect(() => {
    if (!el || !canObserve()) return;
    const update = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      // A detached element reports 0; keep the last width until the new element is observed.
      if (w > 0 || el.isConnected) setWidth(Math.max(0, w));
      setFontFamily(getComputedStyle(el).fontFamily);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [el]);

  return [ref, width, fontFamily] as const;
};
