import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import { maxPhotoUploadSize } from '~/common/consts';
import { RootState } from '~/common/types';
import { addFiles, generateUploadUrls } from '~/features/upload';
import { FileMeta, FileValidationError } from '~/features/upload/types';

// Slice

type UploadState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  files: FileMeta[];
  isAddingFiles: boolean;
  uploadUrls: Record<string, PresignedPost>;
  existingItemsInDb: string[];
};

const initialState: UploadState = {
  status: 'idle',
  files: [],
  isAddingFiles: false,
  uploadUrls: {},
  existingItemsInDb: [],
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    fileRemoved(state, action: PayloadAction<string>) {
      state.files = state.files.filter(({ id }) => id !== action.payload);
    },
    uploadStarted(state) {
      state.status = 'pending';
    },
  },
  extraReducers(builder) {
    builder.addCase(addFiles.pending, (state) => {
      state.isAddingFiles = true;
    });
    builder.addCase(addFiles.fulfilled, (state, { payload }) => {
      state.files = state.files.concat(payload);
      state.isAddingFiles = false;
    });
    builder.addMatcher(generateUploadUrls.matchFulfilled, (state, { payload }) => {
      state.uploadUrls = payload.uploadUrls;
      state.existingItemsInDb = payload.existingItemsInDb;
    });
    builder.addMatcher(generateUploadUrls.matchRejected, (state) => {
      state.status = 'error';
    });
  },
});

export const { fileRemoved, uploadStarted } = uploadSlice.actions;

// Selectors

export const selectUploadStatus = (state: RootState) => state.upload.status;
export const selectFiles = (state: RootState) => state.upload.files;
export const selectIsAddingFiles = (state: RootState) => state.upload.isAddingFiles;

export const selectValidationErrorsMap = createSelector(selectFiles, (files) => {
  return Object.fromEntries(
    files.map(({ id, size, exif }) => {
      const { gpsLatitude, gpsLongitude, dateTimeOriginal } = exif;
      const errors: FileValidationError[] = [];

      if (size > maxPhotoUploadSize) errors.push('maxSizeExceeded');
      if (!gpsLatitude || !gpsLongitude) errors.push('missingLocation');
      if (!dateTimeOriginal) errors.push('missingDate');

      return [id, errors];
    })
  );
});

export const selectUploadableFiles = createSelector(
  selectFiles,
  selectValidationErrorsMap,
  (files, validationErrors) => files.filter((file) => !validationErrors[file.id].length)
);

// Listeners

startAppListening({
  actionCreator: fileRemoved,
  effect({ payload }, { getOriginalState }) {
    const prevFiles = selectFiles(getOriginalState());
    const removedFile = prevFiles.find(({ id }) => id === payload);
    if (removedFile) URL.revokeObjectURL(removedFile.objectURL);
  },
});

startAppListening({
  actionCreator: uploadStarted,
  effect(action, { dispatch, getState }) {
    const files = selectUploadableFiles(getState());
    const hashes = files.map(({ hash }) => hash);
    const uniqueHashes = [...new Set(hashes)];
    dispatch(generateUploadUrls.initiate(uniqueHashes));
  },
});
