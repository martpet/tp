export const mapTypes = ['esri', 'here'] as const;

export type MapType = typeof mapTypes[number];

export type MapsOptions = {
  mapName: string;
  style: string;
  type: MapType;
};
