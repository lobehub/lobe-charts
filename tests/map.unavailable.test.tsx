import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MapView from '@/MapView';

// `maplibre-gl` missing: the loader rejects, as the dynamic import does when the peer is not installed.
vi.mock('@/common/map/loader', () => ({
  loadedMapLibre: () => undefined,
  loadMapLibre: () => Promise.reject(new Error('Cannot find module maplibre-gl')),
  resetMapLibre: () => {},
  setMapLibreWorkerUrl: () => {},
}));

describe('map without maplibre-gl', () => {
  it('shows a clear empty state and still renders the rest of the card', async () => {
    render(<MapView markers={[{ lat: 1, lon: 2, name: 'Somewhere' }]} title="Trip" />);
    expect(screen.getByText('Trip')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Loading map');
    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toBe(
        'Map unavailable: install maplibre-gl to show it',
      ),
    );
    expect(screen.getByText('Somewhere')).toBeTruthy();
  });

  it('takes a custom unavailable text', async () => {
    render(<MapView markers={[{ lat: 1, lon: 2, name: 'x' }]} unavailableText="No map here" />);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('No map here'));
  });
});
