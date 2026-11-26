import { cx } from '@lobehub/ui';
import type { ReactNode } from 'react';
import { memo } from 'react';

import { styles } from './styles';

export interface A2uiTooltipRow {
  active?: boolean;
  color?: string;
  label: ReactNode;
  value: ReactNode;
}

export interface A2uiTooltipProps {
  rows: A2uiTooltipRow[];
  title?: ReactNode;
}

// Tooltip chrome of the official charts (TanStack tooltip with the a2ui variables).
const A2uiTooltip = memo<A2uiTooltipProps>(({ title, rows }) => {
  if (!title && rows.length === 0) return null;
  return (
    <div className={styles.tooltip} role="status">
      {title !== undefined && title !== null && title !== '' ? (
        <div className={styles.tooltipTitle}>{title}</div>
      ) : null}
      <div>
        {rows.map((row, i) => (
          <div className={cx(styles.tooltipRow, row.active && styles.tooltipRowActive)} key={i}>
            {row.color ? (
              <span className={styles.tooltipSwatch} style={{ background: row.color }} />
            ) : (
              <span />
            )}
            <span>{row.label}</span>
            <span className={styles.tooltipValue}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

A2uiTooltip.displayName = 'A2uiTooltip';

export default A2uiTooltip;
