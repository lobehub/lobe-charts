'use client';

import { cx } from '@lobehub/ui';
import { Clock, Map as MapIcon, MapPin, Navigation } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

import {
  cardStyles,
  directionsUrl as googleDirectionsUrl,
  isLngLat,
  type MapBaseProps,
  MapCanvas,
  MapCard,
  MapPlaceholder,
  type MapPoint,
  openStreetMapUrl,
  Rating,
  useMapAccent,
} from '@/common/map';

import { styles } from './styles';

export interface LocationCardProps extends MapBaseProps {
  /** Street address under the name. */
  address?: string;
  /** Short tag on the right, e.g. `Coffee shop`. */
  category?: string;
  /**
   * Label of the Directions button.
   * @default 'Directions'
   */
  directionsText?: ReactNode;
  /** Link of the Directions button. Defaults to Google Maps directions to the point. */
  directionsUrl?: string;
  /** Opening hours, e.g. `Open until 6 PM`. */
  hours?: string;
  /** Latitude in degrees. */
  lat: number;
  /** Longitude in degrees. */
  lon: number;
  /**
   * Height of the mini map in px.
   * @default 150
   */
  mapHeight?: number;
  /** Link of the Open map button. Defaults to the point on openstreetmap.org. */
  mapUrl?: string;
  /** Place name. */
  name: string;
  /**
   * Label of the Open map button.
   * @default 'Open map'
   */
  openMapText?: ReactNode;
  /** Rating out of 5, shown with one decimal. */
  rating?: number;
  /**
   * Show the Directions and Open map buttons.
   * @default true
   */
  showActions?: boolean;
  /**
   * Zoom of the mini map.
   * @default 14.5
   */
  zoom?: number;
}

// Adapted from CopilotKit a2ui-playground (MIT): maps.tsx `LocationCard`.
const LocationCard = ({
  name,
  address,
  lat,
  lon,
  category,
  rating,
  hours,
  mapHeight = 150,
  zoom = 14.5,
  showActions = true,
  directionsUrl,
  mapUrl,
  directionsText = 'Directions',
  openMapText = 'Open map',
  basemap = 'auto',
  mapStyle,
  color,
  unavailableText,
  variant = 'default',
  className,
  style,
  ref,
}: LocationCardProps) => {
  const ok = isLngLat(lon, lat);
  const { accent, ink } = useMapAccent(color);
  const point = useMemo<MapPoint[]>(() => (ok ? [{ lat, lon, name }] : []), [ok, name, lat, lon]);

  return (
    <MapCard
      accent={accent}
      accentInk={ink}
      className={className}
      ref={ref}
      style={style}
      variant={variant}
    >
      <div className={cx(cardStyles.frame, styles.map)} style={{ height: mapHeight }}>
        {ok ? (
          <MapCanvas
            plainPins
            accent={accent}
            basemap={basemap}
            interactive={false}
            lightBasemap={variant === 'a2ui' ? 'liberty' : 'positron'}
            mapStyle={mapStyle}
            points={point}
            unavailableText={unavailableText}
            zoom={zoom}
          />
        ) : (
          <MapPlaceholder kind="empty" label="Locating" />
        )}
        <div className={styles.fade} />
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <div className={styles.titleBlock}>
            <span className={styles.name}>{name}</span>
            {address ? (
              <span className={styles.address}>
                <MapPin className={styles.addressIcon} size={12} />
                <span className={styles.addressText}>{address}</span>
              </span>
            ) : null}
          </div>
          {category ? <span className={styles.badge}>{category}</span> : null}
        </div>
        {(rating !== undefined && rating !== null) || hours ? (
          <div className={styles.meta}>
            <Rating value={rating} />
            {hours ? (
              <span className={styles.hours}>
                <Clock size={12} />
                {hours}
              </span>
            ) : null}
          </div>
        ) : null}
        {ok && showActions ? (
          <div className={styles.actions}>
            <a
              className={cx(styles.button, styles.buttonPrimary)}
              href={directionsUrl ?? googleDirectionsUrl(lat, lon)}
              rel="noreferrer"
              target="_blank"
            >
              <Navigation size={14} />
              {directionsText}
            </a>
            <a
              className={styles.button}
              href={mapUrl ?? openStreetMapUrl(lat, lon)}
              rel="noreferrer"
              target="_blank"
            >
              <MapIcon size={14} />
              {openMapText}
            </a>
          </div>
        ) : null}
      </div>
    </MapCard>
  );
};

LocationCard.displayName = 'LocationCard';

export default LocationCard;
