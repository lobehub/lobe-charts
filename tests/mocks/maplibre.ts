// A small stand-in for `maplibre-gl`: records maps and markers, fires `style.load` and `load` on the next
// tick, and appends marker elements to the map container so tests can click them.
import { vi } from 'vitest';

type Handler = (e?: any) => void;

export const created = { maps: [] as FakeMap[], markers: [] as FakeMarker[] };

export class FakeMap {
  addLayer = vi.fn();
  addSource = vi.fn();
  container: HTMLElement;
  controls: unknown[] = [];
  easeTo = vi.fn();
  fitBounds = vi.fn();
  flyTo = vi.fn();
  handlers: Record<string, Handler[]> = {};
  layers: { id: string; paint?: Record<string, unknown> }[] = [];
  options: Record<string, any>;
  remove = vi.fn();
  setLayoutProperty = vi.fn();
  setPaintProperty = vi.fn();
  setStyle = vi.fn();

  constructor(options: Record<string, any>) {
    this.options = options;
    this.container = options.container;
    created.maps.push(this);
    setTimeout(() => {
      this.fire('style.load');
      this.fire('load');
    }, 0);
  }

  addControl(control: unknown) {
    this.controls.push(control);
  }
  fire(event: string, e?: unknown) {
    for (const h of this.handlers[event] ?? []) h(e);
  }
  getContainer() {
    return this.container;
  }
  getLayer() {
    return undefined;
  }
  getSource() {
    return undefined;
  }
  getStyle() {
    return { layers: this.layers };
  }
  getZoom() {
    return 12;
  }
  isStyleLoaded() {
    return true;
  }
  on(event: string, handler: Handler) {
    (this.handlers[event] ??= []).push(handler);
    return this;
  }
  removeLayer() {}
  removeSource() {}
  resize() {}
}

export class FakeMarker {
  element: HTMLElement;
  lngLat?: [number, number];
  options: Record<string, any>;
  constructor(options: Record<string, any>) {
    this.options = options;
    this.element = options.element;
    created.markers.push(this);
  }
  addTo(map: FakeMap) {
    map.container.append(this.element);
    return this;
  }
  remove() {
    this.element.remove();
    created.markers = created.markers.filter((m) => m !== this);
  }
  setLngLat(c: [number, number]) {
    this.lngLat = c;
    return this;
  }
}

export class AttributionControl {
  constructor(public options?: unknown) {}
}
export class NavigationControl {
  constructor(public options?: unknown) {}
}

export const setWorkerUrl = vi.fn();

const lib = {
  AttributionControl,
  Map: FakeMap,
  Marker: FakeMarker,
  NavigationControl,
  setWorkerUrl,
};

export default lib;

export const resetCreated = () => {
  created.maps = [];
  created.markers = [];
};

export { FakeMap as Map, FakeMarker as Marker };
