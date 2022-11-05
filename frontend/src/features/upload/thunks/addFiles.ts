import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { FileMeta } from '~/features/upload/types';

export const addFiles = createAsyncThunk(
  'upload/addFilesStatus',
  async (fileList: FileList, thunkAPI) => {
    const filesMeta: FileMeta[] = [];
    const state = thunkAPI.getState() as RootState;
    const currentFilesKeys = state.upload.filesMeta.map((file) => file.key);
    const duplicateFilesKeys: string[] = [];

    Array.from(fileList).forEach((file) => {
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
      });
    });

    return {
      filesMeta,
      duplicateFilesKeys,
    };
  }
);
