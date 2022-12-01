import { PhotoExif } from '../PhotoExif';

export type PhotosTableItem = PhotoExif & {
  hash: string;
  userId: string;
  created: number;
};
