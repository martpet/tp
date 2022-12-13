export type PhotoExif = {
  dateTimeOriginal: string;
  gpsLatitude: number;
  gpsLongitude: number;
  gpsAltitude?: number;
  gpsDestBearing?: number;
  gpsHPositioningError?: number;
  gpsSpeed?: number;
  make?: string;
  model?: string;
  lensModel?: string;
};
