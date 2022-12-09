import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { createSelector, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import { maxPhotoUploadSize } from '~/common/consts';
import { RootState } from '~/common/types';
import { selectIsLoggedIn } from '~/features/me';
import {
  addFiles,
  createUploadUrls,
  fileRemoved,
  transferFiles,
} from '~/features/upload';
import { FileMeta, UploadError } from '~/features/upload/types';

// Slice

type UploadState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  files: FileMeta[];
  isAddingFiles: boolean;
  presignedPosts: Record<string, PresignedPost>;
  fingerprintsInDb: string[];
  isTransferStarted: boolean;
  successfulTransfers: string[];
  failedTransfers: string[];
  transfersProgress: Record<string, number>;
};

const initialState: UploadState = {
  status: 'idle',
  files: [],
  isAddingFiles: false,
  presignedPosts: {},
  isTransferStarted: false,
  fingerprintsInDb: [],
  successfulTransfers: [],
  failedTransfers: [],
  transfersProgress: {},
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
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
    builder.addCase(fileRemoved, (state, { payload }) => {
      state.files = state.files.filter(({ id }) => id !== payload);
      if (!state.files.length) state.status = 'idle';
    });
    builder.addCase(transferFiles.pending, (state) => {
      state.isTransferStarted = true;
    });
    builder.addCase(transferFiles.fulfilled, (state, { payload }) => {
      state.successfulTransfers = payload.successfulTransfers;
      state.failedTransfers = payload.failedTransfers;
    });
    builder.addMatcher(createUploadUrls.matchFulfilled, (state, { payload }) => {
      state.presignedPosts = payload.presignedPosts;
      state.fingerprintsInDb = payload.existingFingerprintsInDb;
    });
    builder.addMatcher(
      isAnyOf(createUploadUrls.matchRejected, transferFiles.rejected),
      (state, { meta: { aborted } }) => {
        state.status = aborted ? 'idle' : 'error';
      }
    );
  },
});

export const { uploadStarted, progressUpdated } = uploadSlice.actions;

// Selectors

export const selectUploadStatus = createSelector(
  selectIsLoggedIn,
  (state: RootState) => state.upload.status,
  (isLoggedIn, status): UploadState['status'] => {
    return isLoggedIn ? status : 'idle';
  }
);

export const selectFiles = (state: RootState) => state.upload.files;
export const selectIsAddingFiles = (state: RootState) => state.upload.isAddingFiles;
export const selectFingerprintsInDb = (state: RootState) => state.upload.fingerprintsInDb;
export const selectIsTransferStarted = (state: RootState) =>
  state.upload.isTransferStarted;
export const selectPresignedPosts = (state: RootState) => state.upload.presignedPosts;
export const selectSuccessfulTransfers = (state: RootState) =>
  state.upload.successfulTransfers;
export const selectFailedTransfers = (state: RootState) => state.upload.failedTransfers;
export const selectTransfersProgress = (state: RootState) =>
  state.upload.transfersProgress;

export const selectFilesErrors = createSelector(
  selectFiles,
  selectFingerprintsInDb,
  selectFailedTransfers,
  (files, fingerprintsInDb, failedTransfers) => {
    const digests: string[] = [];
    return Object.fromEntries(
      files.map(({ id, digest, fingerprint, size, exif }) => {
        const { gpsLatitude, gpsLongitude, dateTimeOriginal } = exif;
        const errors: UploadError[] = [];
        if (size > maxPhotoUploadSize) errors.push('fileTooBig');
        if (!gpsLatitude || !gpsLongitude) errors.push('missingLocation');
        if (!dateTimeOriginal) errors.push('missingDate');
        if (fingerprintsInDb.includes(fingerprint)) errors.push('alreadyUploaded');
        if (failedTransfers.includes(id)) errors.push('transferFailed');
        if (digests.includes(digest)) errors.push('alreadySelected');
        digests.push(digest);
        return [id, errors];
      })
    );
  }
);

export const selectUploadableFiles = createSelector(
  selectFiles,
  selectFilesErrors,
  (files, errors) => files.filter((file) => !errors[file.id].length)
);

export const selectTransferredFiles = createSelector(
  selectUploadableFiles,
  selectSuccessfulTransfers,
  (files, successfulTransfers) =>
    files.filter(({ id }) => successfulTransfers.includes(id))
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
    const queryArg = files.map(({ id, fingerprint, digest }) => ({
      id,
      fingerprint,
      digest,
    }));
    dispatch(createUploadUrls.initiate(queryArg));
  },
});

startAppListening({
  matcher: createUploadUrls.matchFulfilled,
  effect(action, { dispatch }) {
    dispatch(transferFiles());
  },
});
