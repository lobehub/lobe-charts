import { cx } from '@lobehub/ui';
import { memo } from 'react';

import { useThemeColorRange } from '@/hooks/useThemeColorRange';

import { styles } from './styles';
import { a2uiPaletteAt } from './tokens';

export type ChartFrameLegendItem = string | { color?: string; label: string; value?: string };

export interface A2uiLegendProps {
  className?: string;
  items: ChartFrameLegendItem[];
}

// Adapted from CopilotKit a2ui-playground (MIT): chart-kit.tsx `Legend`.
const A2uiLegend = memo<A2uiLegendProps>(({ items, className }) => {
  const palette = useThemeColorRange();
  return (
    <div className={cx(styles.legend, className)}>
      {items.map((it, i) => {
        const item = typeof it === 'string' ? { label: it } : it;
        return (
          <span className={styles.legendItem} key={`${item.label}-${i}`}>
            <span
              className={styles.swatch}
              style={{ background: item.color ?? a2uiPaletteAt(i, palette) }}
            />
            <span className={styles.legendLabel}>{item.label}</span>
            {item.value ? <span className={styles.legendValue}>{item.value}</span> : null}
          </span>
        );
      })}
    </div>
  );
});

A2uiLegend.displayName = 'A2uiLegend';

export default A2uiLegend;
