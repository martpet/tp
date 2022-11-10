import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { FileMeta } from '~/features/upload/types';

import { getExifData } from './getExifData';

export const addFiles = createAsyncThunk(
  'upload/addFilesStatus',
  async (fileList: FileList, thunkAPI) => {
    const filesMeta: FileMeta[] = [];
    const state = thunkAPI.getState() as RootState;
    const currentFilesKeys = state.upload.filesMeta.map((file) => file.key);
    const duplicateFilesKeys: string[] = [];

    await Promise.all(
      Array.from(fileList).map(async (file) => {
        const { name, size } = file;
        const key = `${name}-${size}`;

        if (currentFilesKeys.includes(key)) {
          duplicateFilesKeys.push(key);
          return;
        }

        const exif = await getExifData(file);

        const validityErrors: FileMeta['validityErrors'] = [];

        if (!exif.gpsLatitude || !exif.gpsLongitude) {
          validityErrors.push('location');
        }

        filesMeta.push({
          objectURL: URL.createObjectURL(file),
          key,
          name,
          exif,
          validityErrors,
        });
      })
    );

    return {
      filesMeta,
      duplicateFilesKeys,
    };
  }
);
