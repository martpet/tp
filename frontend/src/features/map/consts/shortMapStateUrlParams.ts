import { MapState } from '~/features/map';

export const shortMapStateUrlParams = {
  lon: 'longitude',
  lat: 'latitude',
} as const satisfies Partial<Record<string, keyof MapState['view']>>;
