import { createAsyncThunk } from '@reduxjs/toolkit';

import { FileMeta, getExif, hashFile } from '~/features/upload';

export const addFiles = createAsyncThunk<FileMeta[], FileList>(
  'addFilesStatus',
  (fileList) =>
    Promise.all(
      Array.from(fileList).map(async (file) => {
        const exif = await getExif(file);

        return {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          exif,
          fingerprint: `${exif.dateTimeOriginal}_${exif.gpsLatitude}_${exif.gpsLongitude}`,
          digest: await hashFile(file),
          objectURL: URL.createObjectURL(file),
        };
      })
    )
);
