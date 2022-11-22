import { PhotoExif } from '../PhotoExif';

export type PhotosTableItem = PhotoExif & {
  id: string;
  userId: string;
  hash: string; // global or local secondary index ?
  created: number;
};
