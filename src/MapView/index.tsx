'use client';

import { cx } from '@lobehub/ui';
import { Map as MapIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  cardStyles,
  clampHeight,
  type MapBaseProps,
  MapCanvas,
  MapCard,
  MapHeader,
  MapPlaceholder,
  type MapPoint,
  NumberDot,
  useMapAccent,
  validPoints,
} from '@/common/map';

import { styles } from './styles';

export type MapMarker = MapPoint;

export interface MapViewProps extends MapBaseProps {
  /**
   * Height of the map in px, clamped to 160-640.
   * @default 340
   */
  height?: number;
  /** Places to pin, numbered in order. Items without a valid `lat` / `lon` are skipped. */
  markers: MapMarker[];
  /** Called when a marker or its chip is selected (`null` when cleared). */
  onActiveChange?: (index: number | null, marker: MapMarker | null) => void;
  /**
   * Show the chip row under the map that links each chip to its marker.
   * @default true
   */
  showChips?: boolean;
  /** Header title. Without it, the header still shows when there are markers, titled `Map`. */
  title?: string;
  /** Zoom used when every marker sits on the same spot; otherwise the map fits all markers. */
  zoom?: number;
}

// Adapted from CopilotKit a2ui-playground (MIT): maps.tsx `MapView`.
const MapView = ({
  markers,
  title,
  height: heightProp,
  zoom,
  showChips = true,
  onActiveChange,
  basemap = 'auto',
  mapStyle,
  color,
  unavailableText,
  variant = 'default',
  className,
  style,
  ref,
}: MapViewProps) => {
  const points = useMemo(() => validPoints<MapMarker>(markers), [markers]);
  const [active, setActiveState] = useState<number | null>(null);
  const { accent, ink } = useMapAccent(color);
  const height = clampHeight(heightProp, 340);
  const setActive = (i: number | null) => {
    setActiveState(i);
    onActiveChange?.(i, i === null ? null : (points[i] ?? null));
  };
  const count = points.length;

  return (
    <MapCard
      accent={accent}
      accentInk={ink}
      className={className}
      ref={ref}
      style={style}
      variant={variant}
    >
      {title || count > 0 ? (
        <MapHeader
          icon={<MapIcon size={14} />}
          meta={count > 0 ? `${count} ${count === 1 ? 'place' : 'places'}` : null}
          title={title ?? 'Map'}
        />
      ) : null}
      <div className={cx(cardStyles.frame, cardStyles.frameLines)} style={{ height }}>
        {count > 0 ? (
          <MapCanvas
            popup
            accent={accent}
            active={active}
            basemap={basemap}
            lightBasemap={variant === 'a2ui' ? 'liberty' : 'positron'}
            mapStyle={mapStyle}
            points={points}
            unavailableText={unavailableText}
            zoom={zoom}
            onActivate={setActive}
          />
        ) : (
          <MapPlaceholder kind="empty" />
        )}
      </div>
      {showChips && count > 0 ? (
        <div className={styles.chips}>
          {points.map((p, i) => (
            <button
              aria-pressed={active === i}
              className={cx(styles.chip, active === i && styles.chipActive)}
              key={`${p.id ?? p.name}-${i}`}
              type="button"
              onClick={() => setActive(active === i ? null : i)}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <NumberDot active={active === i} n={i + 1} />
              <span className={styles.chipLabel}>{p.name}</span>
            </button>
          ))}
        </div>
      ) : null}
    </MapCard>
  );
};

MapView.displayName = 'MapView';

export default MapView;
