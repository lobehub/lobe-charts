// Tuning for the `auto` basemaps, applied in place after the style loads. OpenFreeMap styles are drawn for
// full-screen maps; inside a card they read better calmer and without road shields, close to the street and
// dark basemaps of the official A2UI playground. Named basemaps (`basemap="liberty"` etc.) are left as is.

const WATER = '#cfdfe2';

/** Liberty colour -> softer colour. Keys are the exact paint values in the Liberty style. */
const LIBERTY_REMAP: Record<string, string> = {
  '#a0c8f0': WATER,
  '#e9ac77': '#f1d7ad',
  '#fc8': '#fbe1ae',
  '#fea': '#fdf1cf',
  '#ffdaa6': '#fbe6bd',
  '#fff4c6': '#fdf4dc',
  'rgb(158,189,255)': WATER,
};

/** Dark: lift roads, water and labels off the near-black land (layer id -> paint). */
const DARK_PAINT: Record<string, Record<string, unknown>> = {
  highway_major_casing: { 'line-color': 'rgba(120,120,130,0.55)' },
  highway_major_inner: { 'line-color': '#1d1d21' },
  highway_major_subtle: { 'line-color': '#34343a' },
  highway_minor: { 'line-color': '#26262b' },
  highway_motorway_casing: { 'line-color': 'rgba(130,130,140,0.6)' },
  highway_motorway_inner: { 'line-color': '#2a2a30' },
  highway_motorway_subtle: { 'line-color': '#3a3a40' },
  highway_name_motorway: { 'text-color': '#7a7a82' },
  highway_name_other: { 'text-color': '#6a6a72' },
  place_city: { 'text-color': '#c8c8ce' },
  place_city_large: { 'text-color': '#d4d4da' },
  place_other: { 'text-color': '#8c8c94' },
  place_suburb: { 'text-color': '#8c8c94' },
  place_town: { 'text-color': '#a8a8b0' },
  place_village: { 'text-color': '#8c8c94' },
  water: { 'fill-color': '#25282e' },
  water_name: { 'text-color': '#7c8490', 'text-halo-color': 'rgba(0,0,0,0.6)' },
  waterway: { 'line-color': '#25282e' },
};

const PAINT_KEYS = ['fill-color', 'line-color'] as const;

/**
 * Place labels of Liberty and Positron (same layer ids): smaller, and slate (Liberty) or grey (Positron)
 * instead of large black. Layer id -> text size from zoom 11.
 */
const LIBERTY_LABELS: Record<string, number> = {
  label_city: 14,
  label_city_capital: 15,
  label_town: 12,
  label_village: 11,
};
const LABEL_INK = '#44546a';
const NEUTRAL_INK = '#5c5c5c';

/** Liberty layers that crowd a small map: points of interest, transit stops, one-way arrows. */
const LIBERTY_HIDDEN = /^(?:poi_|road_one_way_arrow)/;

export type BasemapTuning = 'liberty' | 'positron' | 'dark';

interface StyleLayer {
  id: string;
  paint?: Record<string, unknown>;
}

interface TunableMap {
  getStyle: () => { layers?: StyleLayer[] } | undefined;
  setLayoutProperty: (id: string, name: string, value: unknown) => void;
  setPaintProperty: (id: string, name: string, value: unknown) => void;
}

const remapValue = (value: unknown): unknown => {
  if (typeof value === 'string') return LIBERTY_REMAP[value] ?? value;
  if (Array.isArray(value)) return value.map((v) => remapValue(v));
  return value;
};

/** Tunes a loaded OpenFreeMap style. Layers it does not know are left alone. */
export const tuneBasemap = (map: TunableMap, kind: BasemapTuning) => {
  const layers = map.getStyle()?.layers ?? [];
  for (const layer of layers) {
    if (/shield/.test(layer.id)) {
      map.setLayoutProperty(layer.id, 'visibility', 'none');
      continue;
    }
    if (kind === 'dark') {
      for (const [key, value] of Object.entries(DARK_PAINT[layer.id] ?? {}))
        map.setPaintProperty(layer.id, key, value);
      continue;
    }
    if (layer.id in LIBERTY_LABELS) {
      const size = LIBERTY_LABELS[layer.id];
      map.setLayoutProperty(layer.id, 'text-size', [
        'interpolate',
        ['linear'],
        ['zoom'],
        4,
        size - 3,
        11,
        size,
      ]);
      map.setPaintProperty(layer.id, 'text-color', kind === 'liberty' ? LABEL_INK : NEUTRAL_INK);
      continue;
    }
    if (kind !== 'liberty') continue;
    if (LIBERTY_HIDDEN.test(layer.id)) {
      map.setLayoutProperty(layer.id, 'visibility', 'none');
      continue;
    }
    if (layer.id === 'building-3d') {
      // Flat footprints instead of extruded blocks.
      map.setPaintProperty(layer.id, 'fill-extrusion-height', 0);
      map.setPaintProperty(layer.id, 'fill-extrusion-base', 0);
      map.setPaintProperty(layer.id, 'fill-extrusion-color', '#e6ddd2');
      continue;
    }
    for (const key of PAINT_KEYS) {
      const value = layer.paint?.[key];
      if (value === undefined) continue;
      const next = remapValue(value);
      if (JSON.stringify(next) !== JSON.stringify(value)) map.setPaintProperty(layer.id, key, next);
    }
  }
};
