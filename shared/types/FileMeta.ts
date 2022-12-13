import { PhotoExif } from './PhotoExif';

export type FileMeta = {
  id: string;
  name: string;
  size: number;
  fingerprint: string;
  digest: string;
  exif: Partial<PhotoExif>;
  objectURL: string;
};

export type UplaodableFileMeta = Omit<FileMeta, 'exif'> & { exif: PhotoExif };
