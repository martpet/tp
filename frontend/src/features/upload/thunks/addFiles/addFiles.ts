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

        filesMeta.push({
          key,
          name,
          objectURL: URL.createObjectURL(file),
          exif: await getExifData(file),
        });
      })
    );

    return {
      filesMeta,
      duplicateFilesKeys,
    };
  }
);
