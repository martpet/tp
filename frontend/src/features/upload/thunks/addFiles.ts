import { createAsyncThunk } from '@reduxjs/toolkit';

import { FileMeta } from '~/features/upload/types';

declare global {
  interface Window {
    uploadBlobs: Record<string, File>;
  }
}

window.uploadBlobs = {};

export const addFiles = createAsyncThunk(
  'upload/addFilesStatus',
  async (fileList: FileList) => {
    const filesMeta: FileMeta[] = [];
    const duplicateFilesKeys: string[] = [];

    Array.from(fileList).forEach((file) => {
      const { name, size } = file;
      const key = `${name}-${size}`;

      if (Object.keys(window.uploadBlobs).includes(key)) {
        duplicateFilesKeys.push(key);
        return;
      }

      window.uploadBlobs[key] = file;

      filesMeta.push({ key, name });
    });

    return {
      filesMeta,
      duplicateFilesKeys,
    };
  }
);
