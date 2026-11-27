// Basemaps. The default ones are OpenFreeMap (https://openfreemap.org): keyless, free for commercial use,
// OpenStreetMap data. CARTO is listed as a fallback only.

/** OpenFreeMap vector styles. */
export const OPENFREEMAP_STYLES = {
  /** Colourful street map, a little bolder than Liberty. */
  bright: 'https://tiles.openfreemap.org/styles/bright',
  /** Near-black map with grey roads and soft labels. The dark default. */
  dark: 'https://tiles.openfreemap.org/styles/dark',
  /** Slate-blue dark map. */
  fiord: 'https://tiles.openfreemap.org/styles/fiord',
  /** Street map with blue water, green parks and buildings. The light default of the a2ui look. */
  liberty: 'https://tiles.openfreemap.org/styles/liberty',
  /** Pale grey map that keeps the markers in front. The light default of the default look. */
  positron: 'https://tiles.openfreemap.org/styles/positron',
} as const;

/**
 * CARTO basemaps, kept as a fallback (pass one to `mapStyle`). Keyless, but CARTO's terms limit free use;
 * check them before shipping.
 */
export const CARTO_STYLES = {
  darkMatter: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  positron: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
} as const;

/**
 * A named OpenFreeMap basemap, or `auto` to follow the theme: Dark in dark mode; in light mode Positron for
 * the default look and Liberty for the a2ui look.
 */
export type MapBasemap = 'auto' | keyof typeof OPENFREEMAP_STYLES;

/** A MapLibre style: a style URL or a style object. */
export type MapStyleInput = string | Record<string, unknown>;

/** A style per theme mode. */
export interface ThemedMapStyle {
  dark: MapStyleInput;
  light: MapStyleInput;
}

const DARK_BASEMAPS = new Set<MapBasemap>(['dark', 'fiord']);

export interface ResolvedMapStyle {
  /** Whether the basemap is dark, so markers, route casing and map controls can match it. */
  dark: boolean;
  style: MapStyleInput;
}

const isThemed = (s: unknown): s is ThemedMapStyle =>
  !!s && typeof s === 'object' && 'light' in s && 'dark' in s;

/** Picks the style to draw: `mapStyle` wins over `basemap`; `auto` follows the theme. */
export const resolveMapStyle = (
  basemap: MapBasemap = 'auto',
  isDarkMode: boolean,
  mapStyle?: MapStyleInput | ThemedMapStyle,
  lightDefault: 'liberty' | 'positron' = 'positron',
): ResolvedMapStyle => {
  if (mapStyle) {
    if (isThemed(mapStyle))
      return { dark: isDarkMode, style: isDarkMode ? mapStyle.dark : mapStyle.light };
    return { dark: isDarkMode, style: mapStyle };
  }
  const name: keyof typeof OPENFREEMAP_STYLES =
    basemap === 'auto' ? (isDarkMode ? 'dark' : lightDefault) : basemap;
  return { dark: DARK_BASEMAPS.has(name), style: OPENFREEMAP_STYLES[name] };
};
