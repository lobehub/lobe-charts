import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetMapLibre } from '@/common/map/loader';
import LocationCard from '@/LocationCard';

import { created, resetCreated } from './mocks/maplibre';

vi.mock('maplibre-gl', async () => import('./mocks/maplibre'));

const place = {
  address: '66 Mint St, San Francisco, CA 94103',
  category: 'Coffee shop',
  hours: 'Open until 6 PM',
  lat: 37.7825,
  lon: -122.4073,
  name: 'Blue Bottle Coffee',
  rating: 4.6,
};

describe('LocationCard', () => {
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

  it('shows the place details and links', async () => {
    const { container } = render(<LocationCard {...place} variant="a2ui" />);
    expect(screen.getByText('Blue Bottle Coffee')).toBeTruthy();
    expect(screen.getByText('66 Mint St, San Francisco, CA 94103')).toBeTruthy();
    expect(screen.getByText('Coffee shop')).toBeTruthy();
    expect(screen.getByText('4.6')).toBeTruthy();
    expect(screen.getByText('Open until 6 PM')).toBeTruthy();
    expect(container.firstElementChild?.getAttribute('data-variant')).toBe('a2ui');

    const links = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual([
      'https://www.google.com/maps/dir/?api=1&destination=37.7825,-122.4073',
      'https://www.openstreetmap.org/?mlat=37.7825&mlon=-122.4073#map=17/37.7825/-122.4073',
    ]);

    // A static mini map: centred on the place at zoom 14.5, one plain pin, no zoom buttons.
    await waitFor(() => expect(created.markers.length).toBe(1));
    const map = created.maps[0];
    expect(map.options.interactive).toBe(false);
    expect(map.options.center).toEqual([-122.4073, 37.7825]);
    expect(map.options.zoom).toBe(14.5);
    expect(map.controls.length).toBe(1);
    expect(created.markers[0].element.textContent).toBe('');
  });

  it('takes custom links and labels, or hides them', () => {
    const { container, rerender } = render(
      <LocationCard
        {...place}
        directionsText="Route"
        directionsUrl="https://example.com/d"
        mapUrl="https://example.com/m"
        openMapText="Map"
      />,
    );
    expect(screen.getByText('Route').closest('a')?.getAttribute('href')).toBe(
      'https://example.com/d',
    );
    expect(screen.getByText('Map').closest('a')?.getAttribute('href')).toBe(
      'https://example.com/m',
    );
    rerender(<LocationCard {...place} showActions={false} />);
    expect(container.querySelectorAll('a').length).toBe(0);
  });

  it('waits without valid coordinates', () => {
    const { container } = render(<LocationCard lat={Number.NaN} lon={0} name="Nowhere" />);
    expect(container.querySelector('[data-map-state="empty"]')).not.toBeNull();
    expect(container.querySelectorAll('a').length).toBe(0);
    expect(created.maps.length).toBe(0);
  });
});
