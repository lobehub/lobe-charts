import { cx } from '@lobehub/ui';
import type { CSSProperties, ReactNode, Ref } from 'react';

import A2uiLegend, { type ChartFrameLegendItem } from './Legend';
import { styles } from './styles';
import { useA2uiThemeClass } from './useA2uiTheme';

export interface A2uiFrameProps {
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
}

export const A2uiEmpty = ({ children = 'No data yet' }: { children?: ReactNode }) => (
  <div className={styles.empty}>{children}</div>
);

// Adapted from CopilotKit a2ui-playground (MIT): chart-kit.tsx `ChartFrame`.
const A2uiFrame = ({
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
}: A2uiFrameProps) => {
  const themeClass = useA2uiThemeClass();
  const showLegend = !!legend && legend.length > 1;
  const hasHeader = !!(title || subtitle || showLegend || aside);
  return (
    <figure
      className={cx(themeClass, styles.card, styles.frame, className)}
      ref={ref}
      style={{ margin: 0, ...style }}
    >
      {hasHeader && (
        <figcaption className={styles.header}>
          <div className={styles.headerText}>
            {title ? <div className={styles.title}>{title}</div> : null}
            {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
          </div>
          {aside || (showLegend ? <A2uiLegend items={legend} /> : null)}
        </figcaption>
      )}
      {empty ? <A2uiEmpty>{emptyText}</A2uiEmpty> : children}
      {footer && !empty ? footer : null}
    </figure>
  );
};

export default A2uiFrame;
