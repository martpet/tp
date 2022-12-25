import { PhotosTableItem } from '../tableItems';

export type GetPhotosRequest = void;
export type GetPhotosResponse = PhotosTableItem;

export type PostPhotosRequest = Omit<PhotosTableItem, 'userId' | 'createdAt'>[];
export type PostPhotosResponse = void;
