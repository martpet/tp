import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import { maxPhotoUploadBytes } from '~/common/consts';
import { RootState } from '~/common/types';
import { addFiles, upload } from '~/features/upload/thunks';
import { FileMeta, FileValidationError } from '~/features/upload/types';

// Slice

type UploadState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  files: FileMeta[];
  isAddingFiles: boolean;
};

const initialState: UploadState = {
  status: 'idle',
  files: [],
  isAddingFiles: false,
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    fileRemoved(state, action: PayloadAction<string>) {
      state.files = state.files.filter(({ id }) => id !== action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(addFiles.pending, (state) => {
      state.isAddingFiles = true;
    });
    builder.addCase(addFiles.fulfilled, (state, action) => {
      state.files = state.files.concat(action.payload);
      state.isAddingFiles = false;
    });
    builder.addCase(upload.pending, (state) => {
      state.status = 'pending';
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

// Listeners

startAppListening({
  actionCreator: fileRemoved,
  effect(action, listenerApi) {
    const prevState = listenerApi.getOriginalState();
    const removedFile = prevState.upload.files.find(({ id }) => id === action.payload);
    if (removedFile) URL.revokeObjectURL(removedFile.objectURL);
  },
});

// Selectors

export const selectUploadStatus = (state: RootState) => state.upload.status;
export const selectAddedFiles = (state: RootState) => state.upload.files;
export const selectIsAddingFiles = (state: RootState) => state.upload.isAddingFiles;

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
