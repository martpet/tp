export const mapProviders = ['esri', 'here'] as const;

export type MapProvider = typeof mapProviders[number];

export type MapsOptions = {
  mapName: string;
  style: string;
  provider: MapProvider;
};
