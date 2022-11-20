import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';

import { FileMeta } from '~/features/upload/types';

import { getExifData } from './getExifData';

export const addFiles = createAsyncThunk<FileMeta[], FileList>(
  'upload/addFilesStatus',
  (fileList) =>
    Promise.all(
      Array.from(fileList).map(async (file) => ({
        id: nanoid(),
        name: file.name,
        fingerPrint: `${file.name}-${file.size}`,
        exif: await getExifData(file),
        objectURL: URL.createObjectURL(file),
      }))
    )
);
