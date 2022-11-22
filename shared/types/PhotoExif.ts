export type PhotoExif = {
  dateTimeOriginal: string;
  gpsAltitude: number;
  gpsLatitude: number;
  gpsLongitude?: number;
  gpsDestBearing?: number;
  gpsHPositioningError?: number;
  gpsSpeed?: number;
  make?: string;
  model?: string;
  lensModel?: string;
};
