export interface SupportedCity {
  name: 'Chennai' | 'Bengaluru' | 'Hyderabad';
  label: string;
  selectLabel: string;
  state: 'Tamil Nadu' | 'Karnataka' | 'Telangana';
  stateShort: 'TN' | 'KA' | 'TS';
  pincode: string;
  defaultLat: string;
  defaultLng: string;
  mapQuery: string;
  showcaseCount: string;
  image: string;
}

export const SUPPORTED_CITIES: SupportedCity[] = [
  {
    name: 'Chennai',
    label: 'Chennai',
    selectLabel: 'Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    stateShort: 'TN',
    pincode: '600041',
    defaultLat: '13.0850',
    defaultLng: '80.1980',
    mapQuery: 'Chennai, Tamil Nadu, India',
    showcaseCount: '64 Venues',
    image:
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Bengaluru',
    label: 'Bengaluru (Bangalore)',
    selectLabel: 'Bengaluru (Bangalore), Karnataka',
    state: 'Karnataka',
    stateShort: 'KA',
    pincode: '560066',
    defaultLat: '12.9716',
    defaultLng: '77.5946',
    mapQuery: 'Bengaluru, Karnataka, India',
    showcaseCount: '52 Venues',
    image:
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Hyderabad',
    label: 'Hyderabad',
    selectLabel: 'Hyderabad, Telangana',
    state: 'Telangana',
    stateShort: 'TS',
    pincode: '500032',
    defaultLat: '17.3850',
    defaultLng: '78.4867',
    mapQuery: 'Hyderabad, Telangana, India',
    showcaseCount: '48 Venues',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=500&q=80',
  },
];

/** Normalizes city query params so "Bangalore" and "Bengaluru" resolve uniformly. */
export function normalizeCityName(city: string): string {
  const trimmed = city.trim().toLowerCase();
  if (trimmed === 'bangalore') return 'bengaluru';
  return trimmed;
}

export function getCityMetadata(cityName: string): SupportedCity | undefined {
  const normalized = normalizeCityName(cityName);
  return SUPPORTED_CITIES.find((c) => c.name.toLowerCase() === normalized);
}

/** Builds a dynamic key-free Google Maps embed URL centered on the selected city or South India. */
export function getCityMapEmbedUrl(cityFilter: string): string {
  const meta = cityFilter && cityFilter !== 'All' ? getCityMetadata(cityFilter) : undefined;
  const query = meta ? meta.mapQuery : 'South India';
  const zoom = meta ? 11 : 5;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
}
