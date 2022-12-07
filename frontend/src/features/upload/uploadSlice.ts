import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { createSelector, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import { maxPhotoUploadSize } from '~/common/consts';
import { RootState } from '~/common/types';
import { addFiles, generateUploadUrls, transferFiles } from '~/features/upload';
import { FileMeta, UploadError } from '~/features/upload/types';

// Slice

type UploadState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  files: FileMeta[];
  isAddingFiles: boolean;
  presignedPosts: Record<string, PresignedPost>;
  fingerprintsInDb: string[];
  successfulTransfers: string[];
  abortedTransfers: string[];
  failedTransfers: string[];
  transfersProgress: Record<string, number>;
};

const initialState: UploadState = {
  status: 'idle',
  files: [],
  isAddingFiles: false,
  presignedPosts: {},
  fingerprintsInDb: [],
  successfulTransfers: [],
  abortedTransfers: [],
  failedTransfers: [],
  transfersProgress: {},
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
    progressUpdated(state, { payload }: PayloadAction<Record<string, number>>) {
      state.transfersProgress = payload;
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
    builder.addCase(transferFiles.fulfilled, (state, { payload }) => {
      state.successfulTransfers = payload.successfulTransfers;
      state.abortedTransfers = payload.abortedTransfers;
      state.failedTransfers = payload.failedTransfers;
    });
    builder.addMatcher(generateUploadUrls.matchFulfilled, (state, { payload }) => {
      state.presignedPosts = payload.presignedPosts;
      state.fingerprintsInDb = payload.existingFingerprintsInDb;
    });
    builder.addMatcher(
      isAnyOf(generateUploadUrls.matchRejected, transferFiles.rejected),
      (state) => {
        state.status = 'error';
      }
    );
  },
});

export const { fileRemoved, uploadStarted, progressUpdated } = uploadSlice.actions;

// Selectors

export const selectUploadStatus = (state: RootState) => state.upload.status;
export const selectFiles = (state: RootState) => state.upload.files;
export const selectIsAddingFiles = (state: RootState) => state.upload.isAddingFiles;
export const selectFingerprintsInDb = (state: RootState) => state.upload.fingerprintsInDb;
export const selectPresignedPosts = (state: RootState) => state.upload.presignedPosts;
export const selectSuccessfulTransfers = (state: RootState) =>
  state.upload.successfulTransfers;
export const selectFailedTransfers = (state: RootState) => state.upload.failedTransfers;

export const selectFilesErrors = createSelector(
  selectFiles,
  selectFingerprintsInDb,
  selectFailedTransfers,
  (files, fingerprintsInDb, failedTransfers) => {
    return Object.fromEntries(
      files.map(({ id, fingerprint, size, exif }) => {
        const { gpsLatitude, gpsLongitude, dateTimeOriginal } = exif;
        const errors: UploadError[] = [];
        if (size > maxPhotoUploadSize) errors.push('maxSizeExceeded');
        if (!gpsLatitude || !gpsLongitude) errors.push('missingLocation');
        if (!dateTimeOriginal) errors.push('missingDate');
        if (fingerprintsInDb.includes(fingerprint)) errors.push('alreadyUploaded');
        if (failedTransfers.includes(fingerprint)) errors.push('transferFailed');
        return [id, errors];
      })
    );
  }
);

export const selectUniqueFiles = createSelector(selectFiles, (files) => {
  const checkedFingerprints: string[] = [];
  return files.filter(({ fingerprint }) => {
    const isUnique = !checkedFingerprints.includes(fingerprint);
    checkedFingerprints.push(fingerprint);
    return isUnique;
  });
});

export const selectUploadableFiles = createSelector(
  selectUniqueFiles,
  selectFilesErrors,
  (files, errors) => files.filter((file) => !errors[file.id].length)
);

export const selectTransferredFiles = createSelector(
  selectUploadableFiles,
  selectSuccessfulTransfers,
  (files, successfulTransfers) =>
    files.filter(({ fingerprint }) => successfulTransfers.includes(fingerprint))
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
    const queryArg = files.map(({ fingerprint, digest }) => ({
      fingerprint,
      digest,
    }));
    dispatch(generateUploadUrls.initiate(queryArg));
  },
});

startAppListening({
  matcher: generateUploadUrls.matchFulfilled,
  effect(action, { dispatch }) {
    dispatch(transferFiles());
  },
});
