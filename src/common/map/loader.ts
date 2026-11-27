// MapLibre GL is an optional peer dependency. It is only imported here, lazily, the first time a map
// component mounts, so apps that never draw a map do not ship it.

/** The parts of the `maplibre-gl` module the map components use. */
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

/** Loads `maplibre-gl` and its stylesheet once. Rejects when the package is not installed. */
export const loadMapLibre = (): Promise<MapLibreModule> => {
  if (loaded) return Promise.resolve(loaded);
  pending ??= Promise.all([
    import('maplibre-gl'),
    // The stylesheet is best effort: without it the map still draws, only the controls lose their icons.
    // @ts-ignore -- stylesheet import, typed by the consumer's bundler
    import('maplibre-gl/dist/maplibre-gl.css').catch(() => undefined),
  ]).then(([mod]) => {
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
