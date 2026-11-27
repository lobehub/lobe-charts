import type { CSSProperties, ReactNode, Ref } from 'react';

import type { ChartVariant } from '@/common/a2ui/types';

import type { MapBasemap, MapStyleInput, ThemedMapStyle } from './basemap';

/** Props every map component takes. */
export interface MapBaseProps {
  /**
   * OpenFreeMap basemap. `auto` follows the theme: Dark in dark mode; in light mode Positron for the
   * default look and Liberty for the a2ui look.
   * @default 'auto'
   */
  basemap?: MapBasemap;
  className?: string;
  /** Marker and route colour. Defaults to the first colour of the theme colour range. */
  color?: string;
  /**
   * Any MapLibre style (URL or object), or one per theme mode as `{ light, dark }`. Wins over `basemap`;
   * use it for a self-hosted style or the CARTO fallback (`CARTO_STYLES`).
   */
  mapStyle?: MapStyleInput | ThemedMapStyle;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  /** Shown instead of the map when `maplibre-gl` is not installed or fails to load. */
  unavailableText?: ReactNode;
  /**
   * Visual style: `default` sits with the other lobe charts; `a2ui` draws the A2UI card.
   * @default 'default'
   */
  variant?: ChartVariant;
}
