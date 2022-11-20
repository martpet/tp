import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { addFiles, upload } from '~/features/upload/thunks';
import { FileMeta, FileValidationError, UploadableFile } from '~/features/upload/types';

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

export const selectDuplicateFiles = createSelector(selectFiles, (files) => {
  const fingerPrints: string[] = [];
  return files.filter((file) => {
    const isDuplicate = fingerPrints.includes(file.fingerPrint);
    fingerPrints.push(file.fingerPrint);
    return isDuplicate;
  });
});

export const selectFilesValidationErrors = createSelector(selectFiles, (files) =>
  Object.fromEntries(
    files.map(({ id, exif }) => {
      const errors: FileValidationError[] = [];
      if (!exif.gpsLatitude || !exif.gpsLongitude) errors.push('missingLocation');
      if (!exif.dateTimeOriginal) errors.push('missingDate');
      return [id, errors];
    })
  )
);

export const selectUploadableFiles = createSelector(
  selectFiles,
  selectDuplicateFiles,
  selectFilesValidationErrors,
  (files, duplicateFiles, validationErrors) =>
    files.filter(
      (file) => !duplicateFiles.includes(file) && !validationErrors[file.id].length
    ) as UploadableFile[]
);
