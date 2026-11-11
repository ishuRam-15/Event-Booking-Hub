import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_CITIES,
  normalizeCityName,
  getCityMetadata,
  getCityMapEmbedUrl,
} from '@/lib/cities';
import { MOCK_VENUES } from '@/lib/mock-data';

describe('3-City Hub Configuration (Chennai, Bengaluru, Hyderabad)', () => {
  it('defines strictly 3 supported Southern Metro hubs', () => {
    expect(SUPPORTED_CITIES).toHaveLength(3);
    expect(SUPPORTED_CITIES.map((c) => c.name)).toEqual([
      'Chennai',
      'Bengaluru',
      'Hyderabad',
    ]);
  });

  it('normalizes Bangalore alias cleanly to Bengaluru', () => {
    expect(normalizeCityName('Bangalore')).toBe('bengaluru');
    expect(normalizeCityName('  bengaluru ')).toBe('bengaluru');
    expect(getCityMetadata('Bangalore')?.state).toBe('Karnataka');
    expect(getCityMetadata('Hyderabad')?.stateShort).toBe('TS');
    expect(getCityMetadata('Mumbai')).toBeUndefined();
  });

  it('generates dynamic city-centered Google Maps embed URLs', () => {
    expect(getCityMapEmbedUrl('All')).toContain('South%20India');
    expect(getCityMapEmbedUrl('Chennai')).toContain('Chennai');
    expect(getCityMapEmbedUrl('Bangalore')).toContain('Bengaluru');
    expect(getCityMapEmbedUrl('Hyderabad')).toContain('Hyderabad');
  });

  it('provides balanced verified mock venues strictly across the 3 cities', () => {
    const citiesInMock = new Set(MOCK_VENUES.map((v) => v.city));
    expect(Array.from(citiesInMock).sort()).toEqual([
      'Bengaluru',
      'Chennai',
      'Hyderabad',
    ]);
    expect(MOCK_VENUES.every((v) => v.isVerified)).toBe(true);
    expect(MOCK_VENUES.filter((v) => v.city === 'Chennai')).toHaveLength(2);
    expect(MOCK_VENUES.filter((v) => v.city === 'Bengaluru')).toHaveLength(2);
    expect(MOCK_VENUES.filter((v) => v.city === 'Hyderabad')).toHaveLength(2);
  });
});
