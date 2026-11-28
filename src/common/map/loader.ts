// MapLibre GL is an optional peer dependency. It is only imported here, lazily, the first time a map
// component mounts, so apps that never draw a map do not ship it.

/** The parts of the `maplibre-gl` module the map components use. */
import { MAPLIBRE_CSS } from './maplibreCss';

export type MapLibreModule = typeof import('maplibre-gl');

let pending: Promise<MapLibreModule> | undefined;
let loaded: MapLibreModule | undefined;
let workerUrl: string | undefined;

const pick = (mod: any): MapLibreModule => (mod?.Map ? mod : (mod?.default ?? mod));

/**
 * Where MapLibre GL 6 loads its web worker from. MapLibre 6 looks for `maplibre-gl-worker.mjs` next to its
 * own module, which a bundler usually moves; point it at the emitted file instead, e.g. in Vite:
 * `import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'; setMapLibreWorkerUrl(workerUrl);`.
 * MapLibre GL 5 inlines its worker and needs nothing. Safe to call before any map has loaded.
 */
export const setMapLibreWorkerUrl = (url: string) => {
  workerUrl = url;
  loaded?.setWorkerUrl?.(url);
};

const STYLE_ID = 'lobe-charts-maplibre';

/**
 * Adds the MapLibre rules the map components use, once per document. A stylesheet import would leave
 * a CSS-only chunk for every bundler to handle (Vite drops it while other chunks still name it), so
 * the rules ship as a string with the components instead.
 */
const injectMapLibreCss = () => {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = MAPLIBRE_CSS;
  document.head.append(style);
};

/** Loads `maplibre-gl` once, with its stylesheet. Rejects when the package is not installed. */
export const loadMapLibre = (): Promise<MapLibreModule> => {
  if (loaded) return Promise.resolve(loaded);
  injectMapLibreCss();
  pending ??= import('maplibre-gl').then((mod) => {
    const lib = pick(mod);
    if (!lib?.Map) throw new Error('maplibre-gl did not load');
    if (workerUrl) lib.setWorkerUrl?.(workerUrl);
    loaded = lib;
    return lib;
  });
  return pending;
};

/** For tests: forget the loaded module. */
export const resetMapLibre = () => {
  pending = undefined;
  loaded = undefined;
};

/** The module if it has already loaded (lets a remounted map skip the loading frame). */
export const loadedMapLibre = () => loaded;
