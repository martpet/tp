import { createAsyncThunk } from '@reduxjs/toolkit';

import { removeDateStringOffset } from '~/common/utils';
import { FileMeta, getExif, hashFile } from '~/features/upload';

export const addFiles = createAsyncThunk<FileMeta[], FileList>(
  'upload/addFilesStatus',
  (fileList) =>
    Promise.all(
      Array.from(fileList).map(async (file) => {
        const exif = await getExif(file);
        const date = removeDateStringOffset(exif.dateTimeOriginal || '');
        const fingerprint = `${date}_${exif.gpsLatitude}_${exif.gpsLongitude}`;

        return {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          exif,
          fingerprint,
          digest: await hashFile(file),
          objectURL: URL.createObjectURL(file),
        };
      })
    )
);
