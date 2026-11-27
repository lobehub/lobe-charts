// Docs site only: MapLibre GL 6 loads its worker from a separate file, which Vite moves. Point the map
// components at the file Vite serves. Apps do the same once (see the MapView page, "Setup").
import { setMapLibreWorkerUrl } from '@lobehub/charts';
// @ts-ignore -- Vite `?url` import
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

setMapLibreWorkerUrl(workerUrl);
