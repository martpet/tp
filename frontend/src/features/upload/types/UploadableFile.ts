import { SetRequired } from 'type-fest';

import { FileMeta } from './FileMeta';

export type UploadableFile = Omit<FileMeta, 'exif'> & {
  exif: SetRequired<FileMeta['exif'], 'dateTimeOriginal' | 'gpsAltitude' | 'gpsLatitude'>;
};
