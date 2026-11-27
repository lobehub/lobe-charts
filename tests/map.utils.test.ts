import { describe, expect, it, vi } from 'vitest';

import { CARTO_STYLES, OPENFREEMAP_STYLES, resolveMapStyle } from '@/common/map/basemap';
import {
  boundsOf,
  formatDistanceKm,
  isDegenerate,
  isLngLat,
  validPath,
  validPoints,
} from '@/common/map/geo';
import { tuneBasemap } from '@/common/map/soften';

describe('map geo helpers', () => {
  it('checks coordinate ranges', () => {
    expect(isLngLat(-9.2, 38.7)).toBe(true);
    expect(isLngLat(181, 0)).toBe(false);
    expect(isLngLat(0, -91)).toBe(false);
    expect(isLngLat('1', 2)).toBe(false);
    expect(isLngLat(Number.NaN, 2)).toBe(false);
  });

  it('keeps drawable points and fills a missing name', () => {
    const points = validPoints([
      { lat: 1, lon: 2, name: 'a' },
      { lat: 1, lon: 2 },
      { lat: 100, lon: 2, name: 'bad' },
      null,
      'x',
    ]);
    expect(points).toEqual([
      { lat: 1, lon: 2, name: 'a' },
      { lat: 1, lon: 2, name: '' },
    ]);
    expect(validPoints(undefined)).toEqual([]);
  });

  it('keeps complete [lon, lat] pairs of a path', () => {
    expect(validPath([[1, 2, 3], [1], [200, 2], [3, 4]])).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('computes bounds and spots a single point', () => {
    const b = boundsOf([
      [1, 5],
      [3, 2],
    ])!;
    expect(b).toEqual([
      [1, 2],
      [3, 5],
    ]);
    expect(isDegenerate(b)).toBe(false);
    expect(isDegenerate(boundsOf([[1, 1]])!)).toBe(true);
    expect(boundsOf([])).toBeNull();
  });

  it('formats distances', () => {
    expect(formatDistanceKm(0.4)).toBe('400 m');
    expect(formatDistanceKm(1.63)).toBe('1.6 km');
  });
});

describe('resolveMapStyle', () => {
  it('auto follows the theme and the look', () => {
    expect(resolveMapStyle('auto', false)).toEqual({
      dark: false,
      style: OPENFREEMAP_STYLES.positron,
    });
    expect(resolveMapStyle('auto', false, undefined, 'liberty').style).toBe(
      OPENFREEMAP_STYLES.liberty,
    );
    expect(resolveMapStyle('auto', true)).toEqual({ dark: true, style: OPENFREEMAP_STYLES.dark });
  });

  it('named basemaps ignore the theme; mapStyle wins', () => {
    expect(resolveMapStyle('fiord', false)).toEqual({
      dark: true,
      style: OPENFREEMAP_STYLES.fiord,
    });
    expect(resolveMapStyle('bright', true).style).toBe(OPENFREEMAP_STYLES.bright);
    const themed = { dark: CARTO_STYLES.darkMatter, light: CARTO_STYLES.voyager };
    expect(resolveMapStyle('liberty', true, themed).style).toBe(CARTO_STYLES.darkMatter);
    expect(resolveMapStyle('liberty', false, themed).style).toBe(CARTO_STYLES.voyager);
    expect(resolveMapStyle('auto', false, 'https://x/style.json').style).toBe(
      'https://x/style.json',
    );
  });

  it('never points at a keyed provider', () => {
    for (const url of Object.values(OPENFREEMAP_STYLES)) expect(url).not.toMatch(/key=/);
  });
});

describe('tuneBasemap', () => {
  const fakeMap = (layers: { id: string; paint?: Record<string, unknown> }[]) => ({
    getStyle: () => ({ layers }),
    setLayoutProperty: vi.fn(),
    setPaintProperty: vi.fn(),
  });

  it('hides road shields and softens Liberty colours', () => {
    const map = fakeMap([
      { id: 'highway-shield-non-us' },
      { id: 'water', paint: { 'fill-color': 'rgb(158,189,255)' } },
      {
        id: 'road_motorway',
        paint: { 'line-color': ['interpolate', ['linear'], ['zoom'], 5, '#fc8'] },
      },
      { id: 'park', paint: { 'fill-color': '#d8e8c8' } },
      { id: 'poi_transit' },
      { id: 'building-3d' },
    ]);
    tuneBasemap(map, 'liberty');
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      'highway-shield-non-us',
      'visibility',
      'none',
    );
    expect(map.setPaintProperty).toHaveBeenCalledWith('water', 'fill-color', '#cfdfe2');
    expect(map.setPaintProperty).toHaveBeenCalledWith('road_motorway', 'line-color', [
      'interpolate',
      ['linear'],
      ['zoom'],
      5,
      '#fbe1ae',
    ]);
    expect(map.setLayoutProperty).toHaveBeenCalledWith('poi_transit', 'visibility', 'none');
    expect(map.setPaintProperty).toHaveBeenCalledWith('building-3d', 'fill-extrusion-height', 0);
  });

  it('lifts the dark style and leaves positron colours alone', () => {
    const dark = fakeMap([{ id: 'water' }, { id: 'unknown' }]);
    tuneBasemap(dark, 'dark');
    expect(dark.setPaintProperty).toHaveBeenCalledWith('water', 'fill-color', '#25282e');
    expect(dark.setPaintProperty).toHaveBeenCalledTimes(1);
    const positron = fakeMap([{ id: 'water', paint: { 'fill-color': '#fc8' } }]);
    tuneBasemap(positron, 'positron');
    expect(positron.setPaintProperty).not.toHaveBeenCalled();
  });
});
