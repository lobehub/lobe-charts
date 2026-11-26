import { useLayoutEffect, useRef, useState } from 'react';

/** Fallback used where layout is unavailable (SSR, jsdom), so the chart still renders its marks. */
const FALLBACK_WIDTH = 600;

const canObserve = () => typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined';

/** Tracks the content width of an element and the font family it renders with (for text measurement). */
export const useElementWidth = <T extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(() => (canObserve() ? 0 : FALLBACK_WIDTH));
  const [fontFamily, setFontFamily] = useState<string | undefined>();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !canObserve()) return;
    const update = () => {
      setWidth(Math.max(0, Math.floor(el.getBoundingClientRect().width)));
      setFontFamily(getComputedStyle(el).fontFamily);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width, fontFamily] as const;
};
