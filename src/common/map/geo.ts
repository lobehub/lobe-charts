// Pure geo helpers shared by the map components. No React, no window.
// Adapted from CopilotKit a2ui-playground (MIT): renderers/map/geo.ts.

/** A coordinate pair in GeoJSON order: `[longitude, latitude]`. */
export type LngLat = [number, number];

/** A place drawn as a marker. */
export interface MapPoint {
  /** Short text under the name (shown in the marker popup). */
  description?: string;
  /** Stable key; falls back to `name`. */
  id?: string;
  /** Latitude in degrees, -90 to 90. */
  lat: number;
  /** Longitude in degrees, -180 to 180. */
  lon: number;
  /** Label of the marker and of its chip / row. */
  name: string;
}

const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/** True for a longitude / latitude pair that can be drawn. */
export const isLngLat = (lon: unknown, lat: unknown): boolean =>
  finite(lon) && finite(lat) && lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;

/** Keeps only the points that can be drawn; tolerates partial objects while data streams in. */
export const validPoints = <T extends { lat?: unknown; lon?: unknown; name?: unknown }>(
  raw: unknown,
): (T & MapPoint)[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (p): p is T & MapPoint =>
        !!p && typeof p === 'object' && isLngLat((p as MapPoint).lon, (p as MapPoint).lat),
    )
    .map((p) => ({ ...p, name: typeof p.name === 'string' ? p.name : '' }));
};

/** Route coordinates arrive as `[[lon, lat], ...]`; anything incomplete is dropped. */
export const validPath = (raw: unknown): LngLat[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c): c is LngLat => Array.isArray(c) && c.length >= 2 && isLngLat(c[0], c[1]))
    .map((c) => [c[0], c[1]]);
};

/** South-west and north-east corners of a set of coordinates. */
export const boundsOf = (coords: LngLat[]): [LngLat, LngLat] | null => {
  if (coords.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of coords) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return [
    [minX, minY],
    [maxX, maxY],
  ];
};

/** True when every coordinate is (nearly) the same spot, so fitting the bounds would zoom in forever. */
export const isDegenerate = (b: [LngLat, LngLat]): boolean =>
  Math.abs(b[1][0] - b[0][0]) < 1e-4 && Math.abs(b[1][1] - b[0][1]) < 1e-4;

export const centerOf = (b: [LngLat, LngLat]): LngLat => [
  (b[0][0] + b[1][0]) / 2,
  (b[0][1] + b[1][1]) / 2,
];

/** Google Maps directions to a point (opens in a new tab; no API call is made). */
export const directionsUrl = (lat: number, lon: number): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

/** The point on openstreetmap.org. */
export const openStreetMapUrl = (lat: number, lon: number, zoom = 17): string =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;

/** `400 m` under a kilometre, `1.6 km` above. */
export const formatDistanceKm = (km: number): string =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
