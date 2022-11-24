import { PhotoExif } from '~/common/types';

export type FileMeta = {
  id: string;
  name: string;
  size: number;
  exif: Partial<PhotoExif>;
  hash: string;
  objectURL: string;
};
