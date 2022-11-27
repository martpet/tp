import { createAsyncThunk } from '@reduxjs/toolkit';

import { FileMeta } from '~/features/upload/types';
import { getExif, hashFile } from '~/features/upload/utils';

export const addFiles = createAsyncThunk<FileMeta[], FileList>(
  'addFilesStatus',
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
