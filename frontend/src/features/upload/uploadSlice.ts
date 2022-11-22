import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { maxPhotoUploadBytes } from '~/common/consts';
import { RootState } from '~/common/types';
import { addFiles, upload } from '~/features/upload/thunks';
import { FileMeta, FileValidationError } from '~/features/upload/types';

type UploadState = {
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  files: FileMeta[];
};

const initialState: UploadState = {
  status: 'idle',
  files: [],
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    fileRemoved: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(({ id }) => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addFiles.fulfilled, (state, action) => {
      state.files = state.files.concat(action.payload);
    });
    builder.addCase(upload.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(upload.fulfilled, (state) => {
      state.status = 'succeeded';
    });
    builder.addCase(upload.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export const { fileRemoved } = uploadSlice.actions;

export const selectUploadStatus = (state: RootState) => state.upload.status;

export const selectFiles = (state: RootState) => state.upload.files;

export const selectValidationErrorsMap = createSelector(selectFiles, (files) => {
  const hashes: string[] = [];

  return Object.fromEntries(
    files.map(({ id, size, exif, hash }) => {
      const errors: FileValidationError[] = [];

      if (size > maxPhotoUploadBytes) errors.push('maxSizeExceeded');
      if (!exif.gpsLatitude || !exif.gpsLongitude) errors.push('missingLocation');
      if (!exif.dateTimeOriginal) errors.push('missingDate');
      if (hashes.includes(hash)) errors.push('isDuplicate');

      hashes.push(hash);
      return [id, errors];
    })
  );
});

export const selectUploadableFiles = createSelector(
  selectFiles,
  selectValidationErrorsMap,
  (files, validationErrors) => files.filter((file) => !validationErrors[file.id].length)
);
