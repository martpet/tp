import { createAsyncThunk } from '@reduxjs/toolkit';

import { FileMeta } from '~/features/upload/types';

import { getExif } from './getExif';
import { hashFile } from './hashFile';

export const addFiles = createAsyncThunk<FileMeta[], FileList>(
  'upload/addFilesStatus',
  (fileList) =>
    Promise.all(
      Array.from(fileList).map(async (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        exif: await getExif(file),
        hash: await hashFile(file),
        objectURL: URL.createObjectURL(file),
      }))
    )
);
