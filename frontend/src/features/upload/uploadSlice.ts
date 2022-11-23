import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { maxPhotoUploadBytes } from '~/common/consts';
import { RootState } from '~/common/types';
import { addFiles, upload } from '~/features/upload/thunks';
import { FileMeta, FileValidationError } from '~/features/upload/types';

// Slice

type UploadState = {
  status: 'idle' | 'inProgress' | 'success' | 'error';
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
      state.status = 'inProgress';
    });
    builder.addCase(upload.fulfilled, (state) => {
      state.status = 'success';
    });
    builder.addCase(upload.rejected, (state) => {
      state.status = 'error';
    });
  },
});

export const { fileRemoved } = uploadSlice.actions;

// Selectors

export const selectUploadStatus = (state: RootState) => state.upload.status;

export const selectAddedFiles = (state: RootState) => state.upload.files;

export const selectValidationErrorsMap = createSelector(selectAddedFiles, (files) => {
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
  selectAddedFiles,
  selectValidationErrorsMap,
  (files, validationErrors) => files.filter((file) => !validationErrors[file.id].length)
);
