import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetMapLibre } from '@/common/map/loader';
import RouteMap from '@/RouteMap';

import { created, resetCreated } from './mocks/maplibre';

vi.mock('maplibre-gl', async () => import('./mocks/maplibre'));

const coordinates: [number, number][] = [
  [-122.4862, 37.7694],
  [-122.4536, 37.7727],
  [-122.4135, 37.7799],
  [-122.3936, 37.7955],
];

describe('RouteMap', () => {
  beforeEach(() => {
    resetCreated();
    resetMapLibre();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        disconnect() {}
        observe() {}
        unobserve() {}
      },
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the endpoints, stats and legend, and draws the line with start / end pins', async () => {
    render(
      <RouteMap
        coordinates={coordinates}
        distance="8.4 km"
        duration="32 min"
        from="Golden Gate Park"
        title="Cycling route"
        to="Ferry Building"
        variant="a2ui"
      />,
    );
    expect(screen.getByText('Cycling route')).toBeTruthy();
    expect(screen.getByText('Golden Gate Park')).toBeTruthy();
    expect(screen.getByText('Ferry Building')).toBeTruthy();
    expect(screen.getByLabelText('Distance').textContent).toBe('8.4 km');
    expect(screen.getByLabelText('Duration').textContent).toBe('32 min');
    expect(screen.getByText('Start')).toBeTruthy();
    expect(screen.getByText('Destination')).toBeTruthy();
    expect(screen.getByText('4 waypoints')).toBeTruthy();

    await waitFor(() => expect(created.markers.length).toBe(2));
    await act(() => new Promise((r) => setTimeout(r, 10)));
    expect(created.markers.map((m) => m.lngLat)).toEqual([coordinates[0], coordinates[3]]);
    expect(created.markers[0].element.querySelector('[data-kind="start"]')).not.toBeNull();
    expect(created.markers[1].element.querySelector('[data-kind="end"]')).not.toBeNull();

    const map = created.maps[0];
    expect(map.addSource).toHaveBeenCalledWith(
      'lobe-map-route',
      expect.objectContaining({
        data: expect.objectContaining({
          features: [expect.objectContaining({ geometry: { coordinates, type: 'LineString' } })],
        }),
        lineMetrics: true,
      }),
    );
    // Glow, casing and gradient line.
    const layers = map.addLayer.mock.calls.map(([l]: any) => l.id);
    expect(layers.slice(0, 3)).toEqual([
      'lobe-map-route-glow',
      'lobe-map-route-casing',
      'lobe-map-route-line',
    ]);
    const line = map.addLayer.mock.calls[2][0];
    expect(line.paint['line-gradient'][0]).toBe('interpolate');
  });

  it('drops invalid coordinates and waits with fewer than two', () => {
    const { container } = render(
      <RouteMap coordinates={[[0, 0], [999, 1] as any]} from="A" to="B" />,
    );
    expect(container.querySelector('[data-map-state="empty"]')).not.toBeNull();
    expect(screen.getByText('1 waypoint')).toBeTruthy();
    expect(created.maps.length).toBe(0);
  });

  it('takes legend labels', () => {
    render(
      <RouteMap
        coordinates={coordinates}
        from="A"
        legendText={{ destination: 'Ziel', start: 'Start hier' }}
        to="B"
      />,
    );
    expect(screen.getByText('Start hier')).toBeTruthy();
    expect(screen.getByText('Ziel')).toBeTruthy();
  });
});
