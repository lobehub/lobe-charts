import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetMapLibre, setMapLibreWorkerUrl } from '@/common/map/loader';
import MapView from '@/MapView';

import { created, resetCreated, setWorkerUrl } from './mocks/maplibre';

vi.mock('maplibre-gl', async () => import('./mocks/maplibre'));

const markers = [
  { description: 'Tower', lat: 38.6916, lon: -9.216, name: 'Belém Tower' },
  { lat: 38.6979, lon: -9.2068, name: 'Jerónimos Monastery' },
  { lat: 38.7036, lon: -9.1786, name: 'LX Factory' },
  { lat: 999, lon: -9.1, name: 'Broken' },
];

const settle = () => act(() => new Promise((r) => setTimeout(r, 10)));

describe('MapView', () => {
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

  it('renders the header, the chips and one numbered marker per valid place', async () => {
    const { container } = render(<MapView markers={markers} title="Weekend in Lisbon" />);
    expect(screen.getByText('Weekend in Lisbon')).toBeTruthy();
    expect(screen.getByText('3 places')).toBeTruthy();
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      '1Belém Tower',
      '2Jerónimos Monastery',
      '3LX Factory',
    ]);
    expect(container.firstElementChild?.getAttribute('data-variant')).toBe('default');

    await waitFor(() => expect(created.maps.length).toBe(1));
    await settle();
    const map = created.maps[0];
    expect(map.options.style).toBe('https://tiles.openfreemap.org/styles/positron');
    expect(map.options.bounds).toEqual([
      [-9.216, 38.6916],
      [-9.1786, 38.7036],
    ]);
    expect(map.controls.length).toBe(2);
    expect(created.markers.map((m) => m.lngLat)).toEqual([
      [-9.216, 38.6916],
      [-9.2068, 38.6979],
      [-9.1786, 38.7036],
    ]);
    expect(created.markers[1].element.textContent).toBe('2');
  });

  it('links chips and markers both ways', async () => {
    const onActiveChange = vi.fn();
    render(<MapView markers={markers} variant="a2ui" onActiveChange={onActiveChange} />);
    await waitFor(() => expect(created.markers.length).toBe(3));
    await settle();

    const chip = screen.getByText('LX Factory').closest('button')!;
    fireEvent.mouseEnter(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(onActiveChange).toHaveBeenLastCalledWith(
      2,
      expect.objectContaining({ name: 'LX Factory' }),
    );
    fireEvent.mouseLeave(chip);
    expect(onActiveChange).toHaveBeenLastCalledWith(null, null);

    // Clicking a marker activates its chip and opens its popup.
    fireEvent.click(created.markers[0].element);
    expect(screen.getAllByRole('button')[0].getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('tooltip').textContent).toBe('Belém TowerTower');
    expect(created.markers[0].element.style.zIndex).toBe('20');
    // Map click clears it.
    act(() => created.maps[0].fire('click'));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('uses the softened Liberty in the a2ui look and honours mapStyle', async () => {
    created.maps.length = 0;
    const { unmount } = render(<MapView markers={markers} variant="a2ui" />);
    await waitFor(() => expect(created.maps.length).toBe(1));
    expect(created.maps[0].options.style).toBe('https://tiles.openfreemap.org/styles/liberty');
    unmount();
    expect(created.maps[0].remove).toHaveBeenCalled();

    render(<MapView mapStyle="https://example.com/style.json" markers={markers} />);
    await waitFor(() => expect(created.maps.length).toBe(2));
    expect(created.maps[1].options.style).toBe('https://example.com/style.json');
  });

  it('applies the worker URL once MapLibre is in', async () => {
    setMapLibreWorkerUrl('/assets/maplibre-gl-worker.mjs');
    render(<MapView markers={markers} />);
    await waitFor(() => expect(created.maps.length).toBe(1));
    expect(setWorkerUrl).toHaveBeenCalledWith('/assets/maplibre-gl-worker.mjs');
  });

  it('waits with a placeholder when there are no valid markers', () => {
    const { container } = render(<MapView markers={[]} title="Empty" />);
    expect(container.querySelector('[data-map-state="empty"]')).not.toBeNull();
    expect(screen.queryByText(/places/)).toBeNull();
    expect(created.maps.length).toBe(0);
  });

  it('says so when the worker cannot start', async () => {
    render(<MapView markers={markers} />);
    await waitFor(() => expect(created.maps.length).toBe(1));
    act(() => created.maps[0].fire('error', { error: new Error('Worker failed to load') }));
    expect(screen.getByRole('alert').textContent).toMatch(/worker did not start/);
  });
});
