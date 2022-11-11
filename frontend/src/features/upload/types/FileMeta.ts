export type FileMeta = {
  key: string;
  name: string;
  objectURL: string;
  exif: {
    dateTimeOriginal?: string;
    offsetTimeOriginal?: string;
    gpsAltitude?: number;
    gpsLatitude?: number;
    gpsLongitude?: number;
    gpsDestBearing?: number;
    gpsHPositioningError?: number;
    gpsSpeed?: number;
    make?: string;
    model?: string;
    lensModel?: string;
  };
};
