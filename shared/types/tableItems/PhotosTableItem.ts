import { PhotoExif } from '../PhotoExif';

export type PhotosTableItem = PhotoExif & {
  fingerprint: string;
  userId: string;
  createdAt: number;
};
