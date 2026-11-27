'use client';

import { cx } from '@lobehub/ui';
import { MapPin } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  formatDistanceKm,
  type MapBaseProps,
  MapCanvas,
  MapCard,
  MapHeader,
  MapPlaceholder,
  type MapPoint,
  NumberDot,
  Rating,
  useMapAccent,
  validPoints,
} from '@/common/map';

import { styles } from './styles';

export interface Place extends MapPoint {
  /** Street address on the second line. */
  address?: string;
  /** Short tag, e.g. the cuisine. Shown next to the distance when there is room. */
  category?: string;
  /** Distance from the user in km, shown as `400 m` / `1.6 km`. */
  distanceKm?: number;
  /** Rating out of 5. */
  rating?: number;
}

export interface PlaceListProps extends MapBaseProps {
  /**
   * Height of the list and the map in px.
   * @default 340
   */
  height?: number;
  /** Called when a row or a marker is selected (`null` when cleared). */
  onSelectedChange?: (index: number | null, place: Place | null) => void;
  /** Ranked places. Items without a valid `lat` / `lon` are skipped. */
  places: Place[];
  /** Row highlighted at first. The map keeps every place in view until the user picks one. */
  selected?: number;
  /** Footer note, e.g. where the results come from. Rendered as `Source: …`. */
  source?: ReactNode;
  /**
   * Header title.
   * @default 'Places'
   */
  title?: string;
}

// Adapted from CopilotKit a2ui-playground (MIT): maps.tsx `PlaceList`.
const PlaceList = ({
  places: placesProp,
  title = 'Places',
  source,
  selected: selectedProp,
  height = 340,
  onSelectedChange,
  basemap = 'auto',
  mapStyle,
  color,
  unavailableText,
  variant = 'default',
  className,
  style,
  ref,
}: PlaceListProps) => {
  const places = useMemo(() => validPoints<Place>(placesProp), [placesProp]);
  const { accent, ink } = useMapAccent(color);
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelectedState] = useState<number | null>(
    typeof selectedProp === 'number' ? selectedProp : null,
  );
  // A preselected row is only highlighted; the map keeps every place in view until the user picks one.
  const [touched, setTouched] = useState(false);
  const setSelected = (i: number | null) => {
    setTouched(true);
    setSelectedState(i);
    onSelectedChange?.(i, i === null ? null : (places[i] ?? null));
  };
  const active = hover ?? selected;
  const rows = useRef<(HTMLButtonElement | null)[]>([]);

  // A marker click selects a row: keep it in view.
  useEffect(() => {
    if (touched && selected !== null)
      rows.current[selected]?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [selected, touched]);

  return (
    <MapCard
      accent={accent}
      accentInk={ink}
      className={cx(styles.root, className)}
      ref={ref}
      style={{ '--pl-h': `${height}px`, ...style } as CSSProperties}
      variant={variant}
    >
      <MapHeader
        icon={<MapPin size={14} />}
        meta={places.length > 0 ? `${places.length} results` : null}
        title={title}
      />
      <div className={styles.split}>
        <div className={styles.listColumn}>
          <div className={styles.list} onMouseLeave={() => setHover(null)}>
            {places.length === 0
              ? [0, 1, 2].map((i) => <div className={styles.rowSkeleton} key={i} />)
              : places.map((p, i) => (
                  <button
                    aria-pressed={active === i}
                    className={cx(styles.row, active === i && styles.rowActive)}
                    key={`${p.id ?? p.name}-${i}`}
                    type="button"
                    ref={(el) => {
                      rows.current[i] = el;
                    }}
                    onClick={() => setSelected(selected === i ? null : i)}
                    onMouseEnter={() => setHover(i)}
                  >
                    <span className={styles.rowDot}>
                      <NumberDot active={active === i} n={i + 1} />
                    </span>
                    <span className={styles.rowBody}>
                      <span className={styles.rowLine}>
                        <span className={styles.rowName}>{p.name}</span>
                        <Rating value={p.rating} />
                      </span>
                      <span className={cx(styles.rowLine, styles.rowSub)}>
                        <span className={styles.truncate}>
                          {p.address ?? p.description ?? p.category}
                        </span>
                        <span className={styles.rowTail}>
                          {p.category && (p.address || p.description) ? (
                            <span className={styles.rowCategory}>{p.category}</span>
                          ) : null}
                          {typeof p.distanceKm === 'number' && Number.isFinite(p.distanceKm) ? (
                            <span className={styles.tabular}>{formatDistanceKm(p.distanceKm)}</span>
                          ) : null}
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
          </div>
        </div>
        <div className={styles.mapColumn}>
          <div className={styles.mapInner}>
            {places.length > 0 ? (
              <MapCanvas
                accent={accent}
                active={active}
                basemap={basemap}
                focus={touched ? selected : null}
                followActive={touched || hover !== null}
                lightBasemap={variant === 'a2ui' ? 'liberty' : 'positron'}
                mapStyle={mapStyle}
                padding={44}
                points={places}
                unavailableText={unavailableText}
                onActivate={setSelected}
              />
            ) : (
              <MapPlaceholder kind="empty" label="Finding places" />
            )}
          </div>
        </div>
      </div>
      {source ? <div className={styles.source}>Source: {source}</div> : null}
    </MapCard>
  );
};

PlaceList.displayName = 'PlaceList';

export default PlaceList;
