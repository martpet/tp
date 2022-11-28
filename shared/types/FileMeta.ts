import { PhotoExif } from './PhotoExif';

export type FileMeta = {
  id: string;
  name: string;
  size: number;
  exif: Partial<PhotoExif>;
  hash: string;
  objectURL: string;
};
