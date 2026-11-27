'use client';

import { cx, useTheme } from '@lobehub/ui';
import { ArrowRight, Clock, MapPin, Route } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

import {
  cardStyles,
  clampHeight,
  type LngLat,
  type MapBaseProps,
  MapCanvas,
  MapCard,
  MapPlaceholder,
  useMapAccent,
  validPath,
} from '@/common/map';

import { styles } from './styles';

export interface RouteMapProps extends MapBaseProps {
  /** The route as `[[lon, lat], ...]` in travel order. Needs at least two valid points. */
  coordinates: LngLat[];
  /** Distance label, e.g. `8.4 km`, shown over the map. */
  distance?: string;
  /** Duration label, e.g. `32 min`, shown over the map. */
  duration?: string;
  /** Name of the start. */
  from: string;
  /**
   * Height of the map in px, clamped to 160-640.
   * @default 320
   */
  height?: number;
  /**
   * Legend labels under the map.
   * @default { destination: 'Destination', start: 'Start' }
   */
  legendText?: { destination?: ReactNode; start?: ReactNode };
  /** Colour of the start pin and the start of the line. Defaults to the theme success colour. */
  startColor?: string;
  /** Small label above the endpoints, e.g. `Cycling route`. */
  title?: string;
  /** Name of the destination. */
  to: string;
}

const Endpoint = ({ tone, label }: { label?: string; tone: 'start' | 'end' }) => (
  <span className={styles.endpoint}>
    <span
      className={cx(
        styles.endpointIcon,
        tone === 'start' ? styles.endpointStart : styles.endpointEnd,
      )}
    >
      {tone === 'start' ? <span className={styles.endpointDot} /> : <MapPin size={12} />}
    </span>
    <span className={styles.endpointLabel}>{label || '...'}</span>
  </span>
);

// Adapted from CopilotKit a2ui-playground (MIT): maps.tsx `RouteMap`.
const RouteMap = ({
  coordinates,
  from,
  to,
  title,
  distance,
  duration,
  height: heightProp,
  legendText,
  startColor,
  basemap = 'auto',
  mapStyle,
  color,
  unavailableText,
  variant = 'default',
  className,
  style,
  ref,
}: RouteMapProps) => {
  const theme = useTheme();
  const path = useMemo(() => validPath(coordinates), [coordinates]);
  const { accent, ink } = useMapAccent(color);
  const start = startColor ?? theme.colorSuccess;
  const height = clampHeight(heightProp, 320);
  const stats = [
    distance ? { icon: Route, label: 'Distance', value: distance } : null,
    duration ? { icon: Clock, label: 'Duration', value: duration } : null,
  ].filter(Boolean) as { icon: typeof Route; label: string; value: string }[];

  return (
    <MapCard
      accent={accent}
      accentInk={ink}
      className={className}
      ref={ref}
      style={{ '--map-start': start, ...style } as React.CSSProperties}
      variant={variant}
    >
      <div className={styles.header}>
        {title ? <span className={styles.title}>{title}</span> : null}
        <div className={styles.endpoints}>
          <Endpoint label={from} tone="start" />
          <span className={styles.connector}>
            <span className={styles.connectorLine} />
            <ArrowRight size={14} style={{ flexShrink: 0 }} />
          </span>
          <Endpoint label={to} tone="end" />
        </div>
      </div>
      <div className={cx(cardStyles.frame, cardStyles.frameLines)} style={{ height }}>
        {path.length >= 2 ? (
          <MapCanvas
            accent={accent}
            basemap={basemap}
            lightBasemap={variant === 'a2ui' ? 'liberty' : 'positron'}
            mapStyle={mapStyle}
            padding={48}
            route={path}
            startColor={start}
            unavailableText={unavailableText}
          />
        ) : (
          <MapPlaceholder kind="empty" label="Plotting route" />
        )}
        {stats.length > 0 ? (
          <div className={styles.stats}>
            {stats.map((s) => (
              <span aria-label={s.label} className={styles.stat} key={s.label}>
                <s.icon className={styles.statIcon} size={14} />
                {s.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles.footer}>
        <span className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={cx(styles.legendDot, styles.legendStart)} />
            {legendText?.start ?? 'Start'}
          </span>
          <span className={styles.legendItem}>
            <span className={cx(styles.legendDot, styles.legendEnd)} />
            {legendText?.destination ?? 'Destination'}
          </span>
        </span>
        <span className={styles.tabular}>
          {path.length > 0 ? `${path.length} ${path.length === 1 ? 'waypoint' : 'waypoints'}` : ''}
        </span>
      </div>
    </MapCard>
  );
};

RouteMap.displayName = 'RouteMap';

export default RouteMap;
