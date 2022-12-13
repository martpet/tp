import { PhotosTableItem } from '../tableItems';

export type PostPhotosRequest = Omit<PhotosTableItem, 'userId' | 'createdAt'>[];

export type PostPhotosResponse = void;
