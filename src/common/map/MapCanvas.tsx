'use client';

import { cx, useTheme, useThemeMode } from '@lobehub/ui';
import chroma from 'chroma-js';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  type MapBasemap,
  type MapStyleInput,
  resolveMapStyle,
  type ThemedMapStyle,
} from './basemap';
import { boundsOf, centerOf, isDegenerate, type LngLat, type MapPoint } from './geo';
import { loadedMapLibre, loadMapLibre, type MapLibreModule } from './loader';
import MapPlaceholder from './MapPlaceholder';
import { EndPin, Pin } from './Pin';
import { type BasemapTuning, tuneBasemap } from './soften';
import { mapStyles as styles } from './styles';

export interface MapCanvasProps {
  /** Marker / route accent. */
  accent: string;
  /** Index into `points` that is highlighted. */
  active?: number | null;
  basemap?: MapBasemap;
  className?: string;
  /** Index to fly (and zoom) to; wins over `active` for camera moves. */
  focus?: number | null;
  /** Pan to the active point when it changes. */
  followActive?: boolean;
  interactive?: boolean;
  /** Light basemap for `basemap="auto"`. */
  lightBasemap?: 'liberty' | 'positron';
  mapStyle?: MapStyleInput | ThemedMapStyle;
  onActivate?: (index: number | null) => void;
  padding?: number;
  /** Plain dot pins instead of numbered ones (single-place cards). */
  plainPins?: boolean;
  points?: MapPoint[];
  /** Show a name / description bubble over the active marker. */
  popup?: boolean;
  route?: LngLat[];
  /** Colour of the route start. */
  startColor?: string;
  style?: CSSProperties;
  /** Text shown when `maplibre-gl` cannot be loaded. */
  unavailableText?: ReactNode;
  /** Zoom used when there is a single point. */
  zoom?: number;
}

type MapInstance = InstanceType<MapLibreModule['Map']>;
type MarkerInstance = InstanceType<MapLibreModule['Marker']>;

const ROUTE_SOURCE = 'lobe-map-route';
const ROUTE_LAYERS = ['lobe-map-route-glow', 'lobe-map-route-casing', 'lobe-map-route-line'];
const MAX_ZOOM = 15;

const useMapLibre = () => {
  const [state, setState] = useState<{
    lib?: MapLibreModule;
    status: 'loading' | 'ready' | 'error';
  }>(() => {
    const lib = loadedMapLibre();
    return lib ? { lib, status: 'ready' } : { status: 'loading' };
  });
  useEffect(() => {
    if (state.lib) return;
    let live = true;
    loadMapLibre().then(
      (lib) => live && setState({ lib, status: 'ready' }),
      () => live && setState({ status: 'error' }),
    );
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return state;
};

const mix = (a: string, b: string, t: number) => {
  try {
    return chroma.mix(a, b, t, 'rgb').hex();
  } catch {
    return a;
  }
};

/**
 * The map surface shared by MapView, LocationCard, PlaceList and RouteMap: loads MapLibre lazily, draws the
 * basemap, numbered markers or a route, and keeps every coordinate in frame.
 */
// Adapted from CopilotKit a2ui-playground (MIT): renderers/map/map-canvas.tsx (react-map-gl replaced by
// plain MapLibre so the only map dependency is the optional `maplibre-gl` peer).
const MapCanvas = ({
  points = [],
  route = [],
  active = null,
  onActivate,
  followActive = false,
  focus = null,
  interactive = true,
  zoom,
  padding = 56,
  plainPins = false,
  popup = false,
  basemap = 'auto',
  lightBasemap = 'positron',
  mapStyle,
  accent,
  startColor,
  unavailableText,
  className,
  style,
}: MapCanvasProps) => {
  const { isDarkMode } = useThemeMode();
  const theme = useTheme();
  const { lib, status } = useMapLibre();
  const resolved = resolveMapStyle(basemap, isDarkMode, mapStyle, lightBasemap);
  const styleKey =
    typeof resolved.style === 'string' ? resolved.style : JSON.stringify(resolved.style);
  const start = startColor ?? theme.colorSuccess;

  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapInstance | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [markerEls, setMarkerEls] = useState<HTMLElement[]>([]);
  const [endEls, setEndEls] = useState<HTMLElement[]>([]);

  const pad = useMemo(
    () => ({
      bottom: padding,
      left: padding,
      right: padding,
      top: padding + (points.length > 0 ? 30 : 0),
    }),
    [padding, points.length],
  );
  const coords = useMemo<LngLat[]>(
    () => [...points.map((p) => [p.lon, p.lat] as LngLat), ...route],
    [points, route],
  );
  const bounds = useMemo(() => boundsOf(coords), [coords]);
  const sig = bounds
    ? bounds
        .flat()
        .map((n) => n.toFixed(5))
        .join(',')
    : '';
  const pointsSig = points.map((p) => `${p.lon},${p.lat}`).join('|');
  const routeSig = route.map((c) => c.join(',')).join('|');

  // Route paint follows the basemap: pale strokes on a dark casing over dark maps, deeper ones on a white
  // casing over light maps.
  const routeColors = useMemo(
    () =>
      resolved.dark
        ? {
            casing: mix(accent, theme.colorBgLayout, 0.85),
            glow: accent,
            glowOpacity: 0.55,
            stops: [
              mix(start, theme.colorWhite, 0.35),
              mix(accent, theme.colorWhite, 0.25),
              mix(accent, theme.colorWhite, 0.45),
            ],
          }
        : {
            casing: theme.colorWhite,
            glow: accent,
            glowOpacity: 0.28,
            stops: [start, accent, mix(accent, theme.colorWhite, 0.12)],
          },
    [resolved.dark, accent, start, theme.colorBgLayout, theme.colorWhite],
  );

  // Latest values for map callbacks.
  // The `auto` basemaps are tuned for a card (see ./soften).
  const tuning: BasemapTuning | null =
    basemap === 'auto' && !mapStyle ? (isDarkMode ? 'dark' : lightBasemap) : null;
  const latestRef = useRef({
    active,
    bounds,
    camera: active,
    onActivate,
    pad,
    route,
    routeColors,
    tuning,
    zoom,
  });
  latestRef.current = {
    active,
    bounds,
    camera: focus ?? active,
    onActivate,
    pad,
    route,
    routeColors,
    tuning,
    zoom,
  };

  const syncRoute = (m: MapInstance) => {
    const { route: path, routeColors: c } = latestRef.current;
    try {
      drawRoute(m, path, c);
    } catch {
      // The style is still loading; `style.load` draws the route.
    }
  };

  const drawRoute = (m: MapInstance, path: LngLat[], c: typeof routeColors) => {
    for (const id of ROUTE_LAYERS) if (m.getLayer(id)) m.removeLayer(id);
    if (m.getSource(ROUTE_SOURCE)) m.removeSource(ROUTE_SOURCE);
    if (path.length < 2) return;
    m.addSource(ROUTE_SOURCE, {
      data: {
        features: [
          { geometry: { coordinates: path, type: 'LineString' }, properties: {}, type: 'Feature' },
        ],
        type: 'FeatureCollection',
      },
      lineMetrics: true,
      type: 'geojson',
    });
    const layout = { 'line-cap': 'round', 'line-join': 'round' } as const;
    m.addLayer({
      id: ROUTE_LAYERS[0],
      layout,
      paint: {
        'line-blur': 10,
        'line-color': c.glow,
        'line-opacity': c.glowOpacity,
        'line-width': 14,
      },
      source: ROUTE_SOURCE,
      type: 'line',
    });
    m.addLayer({
      id: ROUTE_LAYERS[1],
      layout,
      paint: { 'line-color': c.casing, 'line-opacity': 0.9, 'line-width': 6.5 },
      source: ROUTE_SOURCE,
      type: 'line',
    });
    m.addLayer({
      id: ROUTE_LAYERS[2],
      layout,
      paint: {
        'line-gradient': [
          'interpolate',
          ['linear'],
          ['line-progress'],
          0,
          c.stops[0],
          0.18,
          c.stops[1],
          1,
          c.stops[2],
        ],
        'line-width': 3.5,
      },
      source: ROUTE_SOURCE,
      type: 'line',
    });
  };

  const fit = (m: MapInstance, duration: number) => {
    const { bounds: b, pad: p, zoom: z } = latestRef.current;
    if (!b) return;
    if (isDegenerate(b)) m.easeTo({ center: centerOf(b), duration, zoom: z ?? 14 });
    else m.fitBounds(b, { duration, maxZoom: MAX_ZOOM, padding: p });
  };

  // Create the map once MapLibre is in.
  useEffect(() => {
    const el = containerRef.current;
    if (!lib || !el) return;
    const { bounds: b, pad: p, zoom: z } = latestRef.current;
    const view = !b
      ? { center: [0, 20] as LngLat, zoom: 1 }
      : isDegenerate(b)
        ? { center: centerOf(b), zoom: z ?? 14 }
        : { bounds: b, fitBoundsOptions: { maxZoom: MAX_ZOOM, padding: p } };
    let m: MapInstance;
    try {
      m = new lib.Map({
        attributionControl: false,
        container: el,
        dragRotate: false,
        interactive,
        pitchWithRotate: false,
        scrollZoom: interactive ? { around: 'center' } : false,
        style: resolved.style as any,
        touchPitch: false,
        ...view,
      } as any);
    } catch {
      return;
    }
    m.addControl(new lib.AttributionControl({ compact: true }), 'bottom-right');
    if (interactive) m.addControl(new lib.NavigationControl({ showCompass: false }), 'top-right');
    m.on('load', () => {
      // Start with the attribution collapsed to its (i) button.
      m.getContainer()
        .querySelector('.maplibregl-ctrl-attrib')
        ?.classList.remove('maplibregl-compact-show');
      m.resize();
      setLoaded(true);
    });
    m.on('style.load', () => {
      const { tuning: kind } = latestRef.current;
      if (kind) {
        try {
          tuneBasemap(m as any, kind);
        } catch {
          // Keep the style as it is.
        }
      }
      syncRoute(m);
    });
    m.on('click', () => latestRef.current.onActivate?.(null));
    m.on('error', (e: any) => {
      // A worker that cannot start leaves an empty canvas: say so instead (see `setMapLibreWorkerUrl`).
      if (/worker/i.test(e?.error?.message ?? '')) setFailed(true);
    });
    setMap(m);
    return () => {
      setMap(null);
      setLoaded(false);
      m.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lib, interactive]);

  // Theme or basemap changed: restyle in place (the route is added back on `style.load`).
  const firstStyleRef = useRef(styleKey);
  useEffect(() => {
    if (!map) return;
    if (firstStyleRef.current === styleKey) return;
    firstStyleRef.current = styleKey;
    map.setStyle(resolved.style as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, styleKey]);

  // Route data or colours changed.
  const routeColorSig = routeColors.stops.join() + routeColors.casing;
  useEffect(() => {
    if (map && loaded) syncRoute(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, loaded, routeSig, routeColorSig]);

  // Numbered markers: MapLibre positions the elements, React renders into them.
  useEffect(() => {
    if (!map || !lib) return;
    const created: MarkerInstance[] = [];
    const els = points.map((p, i) => {
      const el = document.createElement('div');
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        latestRef.current.onActivate?.(latestRef.current.active === i ? null : i);
      });
      created.push(
        new lib.Marker({ anchor: 'bottom', element: el }).setLngLat([p.lon, p.lat]).addTo(map),
      );
      return el;
    });
    setMarkerEls(els);
    return () => {
      for (const marker of created) marker.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, lib, pointsSig]);

  // Start / end pins of a route.
  const ends = route.length >= 2 ? `${route[0].join()}|${route.at(-1)!.join()}` : '';
  useEffect(() => {
    if (!map || !lib || !ends) return;
    const created = [route[0], route.at(-1)!].map((c) => {
      const el = document.createElement('div');
      return {
        el,
        marker: new lib.Marker({ anchor: 'center', element: el }).setLngLat(c).addTo(map),
      };
    });
    setEndEls(created.map((c) => c.el));
    return () => {
      for (const c of created) c.marker.remove();
      setEndEls([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, lib, ends]);

  // Keep the active marker on top.
  useEffect(() => {
    markerEls.forEach((el, i) => {
      el.style.zIndex = String(active === i ? 20 : 10 - Math.min(i, 9));
    });
  }, [markerEls, active]);

  // Refit whenever the set of coordinates changes (streaming adds points).
  useEffect(() => {
    if (map && loaded) fit(map, 600);
  }, [map, loaded, sig]);

  // Follow the active point: hover pans to it, a click (`focus`) flies in.
  useEffect(() => {
    if (!map || !loaded || !followActive) return;
    const idx = focus ?? active;
    if (idx === null || idx === undefined) {
      if (bounds && !isDegenerate(bounds))
        map.fitBounds(bounds, { duration: 700, maxZoom: MAX_ZOOM, padding: pad });
      return;
    }
    const p = points[idx];
    if (!p) return;
    if (focus !== null && focus !== undefined)
      map.flyTo({
        center: [p.lon, p.lat],
        duration: 900,
        essential: true,
        zoom: Math.max(map.getZoom(), 14.5),
      });
    else map.easeTo({ center: [p.lon, p.lat], duration: 450 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, active, focus, followActive, loaded]);

  // Containers settle after mount (grids, chat bubbles, streaming): keep the canvas matched to its box and
  // re-fit so markers never sit off-frame.
  useEffect(() => {
    const el = boxRef.current;
    if (!map || !el || typeof ResizeObserver === 'undefined') return;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        map.resize();
        const { camera: a, bounds: b } = latestRef.current;
        if (!b || (a !== null && a !== undefined)) return;
        fit(map, 0);
      });
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [map]);

  return (
    <div
      className={cx(styles.canvas, isDarkMode ? styles.canvasDark : styles.canvasLight, className)}
      data-basemap={resolved.dark ? 'dark' : 'light'}
      ref={boxRef}
      style={{ '--map-accent': accent, ...style } as CSSProperties}
    >
      <div
        ref={containerRef}
        style={{ inset: 0, isolation: 'isolate', position: 'absolute', zIndex: 0 }}
      />
      {status === 'loading' ? <MapPlaceholder kind="loading" /> : null}
      {status === 'error' || failed ? (
        <MapPlaceholder
          kind="unavailable"
          label={
            unavailableText ??
            (failed
              ? 'Map unavailable: the MapLibre worker did not start'
              : 'Map unavailable: install maplibre-gl to show it')
          }
        />
      ) : null}
      {status === 'ready' && !loaded && !failed ? <div className={styles.shimmer} /> : null}
      {markerEls.map((el, i) => {
        const p = points[i];
        if (!p) return null;
        return createPortal(
          <Pin
            active={active === i}
            description={p.description}
            interactive={interactive}
            label={p.name}
            n={i + 1}
            plain={plainPins}
            popup={popup}
          />,
          el,
          `${p.id ?? p.name}-${i}`,
        );
      })}
      {endEls.map((el, i) =>
        createPortal(
          <EndPin kind={i === 0 ? 'start' : 'end'} startColor={start} />,
          el,
          `end-${i}`,
        ),
      )}
    </div>
  );
};

export default MapCanvas;
