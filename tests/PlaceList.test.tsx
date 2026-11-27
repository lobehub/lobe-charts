import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetMapLibre } from '@/common/map/loader';
import PlaceList from '@/PlaceList';

import { created, resetCreated } from './mocks/maplibre';

vi.mock('maplibre-gl', async () => import('./mocks/maplibre'));

const places = [
  {
    address: '1-22-7 Jinnan, Shibuya',
    category: 'Tonkotsu',
    distanceKm: 0.4,
    lat: 35.6614,
    lon: 139.7005,
    name: 'Ichiran Shibuya',
    rating: 4.5,
  },
  { distanceKm: 1.6, lat: 35.6467, lon: 139.7087, name: 'Afuri Ebisu', rating: 4.4 },
  { category: 'Niboshi', lat: 35.6941, lon: 139.7046, name: 'Nagi Shinjuku' },
];

const settle = () => act(() => new Promise((r) => setTimeout(r, 10)));
const rows = () => screen.getAllByRole('button');

describe('PlaceList', () => {
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

  it('lists the places with rating, address, category, distance and the source', async () => {
    render(<PlaceList places={places} source="Sample data" title="Ramen near Shibuya" />);
    expect(screen.getByText('Ramen near Shibuya')).toBeTruthy();
    expect(screen.getByText('3 results')).toBeTruthy();
    expect(screen.getByText('4.5')).toBeTruthy();
    expect(screen.getByText('1-22-7 Jinnan, Shibuya')).toBeTruthy();
    expect(screen.getByText('Tonkotsu')).toBeTruthy();
    expect(screen.getByText('400 m')).toBeTruthy();
    expect(screen.getByText('1.6 km')).toBeTruthy();
    // No address: the category takes the second line, and is not repeated on the right.
    expect(screen.getAllByText('Niboshi').length).toBe(1);
    expect(screen.getByText('Source: Sample data')).toBeTruthy();
    await waitFor(() => expect(created.markers.length).toBe(3));
  });

  it('highlights a preselected row without moving the map', async () => {
    render(<PlaceList places={places} selected={1} />);
    expect(rows()[1].getAttribute('aria-pressed')).toBe('true');
    await waitFor(() => expect(created.maps.length).toBe(1));
    await settle();
    expect(created.maps[0].flyTo).not.toHaveBeenCalled();
  });

  it('links rows and markers both ways', async () => {
    const onSelectedChange = vi.fn();
    render(<PlaceList places={places} onSelectedChange={onSelectedChange} />);
    await waitFor(() => expect(created.markers.length).toBe(3));
    await settle();
    const map = created.maps[0];

    // Hover pans to the row's marker.
    fireEvent.mouseEnter(rows()[2]);
    expect(rows()[2].getAttribute('aria-pressed')).toBe('true');
    expect(map.easeTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ center: [139.7046, 35.6941] }),
    );
    fireEvent.mouseLeave(rows()[2].parentElement!);

    // A row click flies in and reports the place.
    fireEvent.click(rows()[0]);
    expect(onSelectedChange).toHaveBeenLastCalledWith(
      0,
      expect.objectContaining({ name: 'Ichiran Shibuya' }),
    );
    expect(map.flyTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ center: [139.7005, 35.6614] }),
    );

    // A marker click selects its row.
    fireEvent.click(created.markers[1].element);
    expect(rows()[1].getAttribute('aria-pressed')).toBe('true');
    expect(onSelectedChange).toHaveBeenLastCalledWith(
      1,
      expect.objectContaining({ name: 'Afuri Ebisu' }),
    );
  });

  it('shows skeleton rows and a placeholder without places', () => {
    const { container } = render(<PlaceList places={[]} />);
    expect(screen.getByText('Places')).toBeTruthy();
    expect(screen.queryByText(/results/)).toBeNull();
    expect(container.querySelector('[data-map-state="empty"]')).not.toBeNull();
  });
});
