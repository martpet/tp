import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import { createPhotos } from '~/features/photos';
import {
  addFiles,
  createUploadUrls,
  FileMeta,
  fileRemoved,
  selectFiles,
  selectTransferredFiles,
  selectUploadableFiles,
  transferFiles,
  UplaodableFileMeta,
} from '~/features/upload';

export type UploadState = {
  flowStatus: 'idle' | 'pending' | 'done' | 'error';
  files: FileMeta[];
  isAddingFiles: boolean;
  presignedPosts: Record<string, PresignedPost>;
  fingerprintsInDb: string[];
  isTransferStarted: boolean;
  transfersProgress: Record<string, number>;
  successfulTransfers: string[];
  failedTransfers: string[];
  completedUploads: string[];
};

const initialState: UploadState = {
  flowStatus: 'idle',
  files: [],
  isAddingFiles: false,
  presignedPosts: {},
  fingerprintsInDb: [],
  isTransferStarted: false,
  transfersProgress: {},
  successfulTransfers: [],
  failedTransfers: [],
  completedUploads: [],
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    uploadStarted(state) {
      state.flowStatus = 'pending';
      state.isTransferStarted = false;
      state.transfersProgress = {};
      state.successfulTransfers = [];
      state.failedTransfers = [];
    },
    progressUpdated(state, { payload }: PayloadAction<Record<string, number>>) {
      state.transfersProgress = payload;
    },
    userIsDone() {
      return initialState;
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
      if (!state.files.length) {
        state.flowStatus = 'idle';
      }
    });

    builder.addCase(transferFiles.pending, (state) => {
      state.isTransferStarted = true;
    });

    builder.addCase(transferFiles.fulfilled, (state, { payload }) => {
      state.successfulTransfers = state.successfulTransfers.concat(
        payload.successfulTransfers
      );
      state.failedTransfers = payload.failedTransfers;
    });

    builder.addMatcher(createUploadUrls.matchFulfilled, (state, { payload }) => {
      state.presignedPosts = payload.presignedPosts;
      if (!Object.keys(payload.presignedPosts).length) {
        state.flowStatus = 'done';
      }
      state.fingerprintsInDb = state.fingerprintsInDb.concat(
        payload.existingFingerprintsInDb
      );
    });

    builder.addMatcher(
      isAnyOf(
        createUploadUrls.matchRejected,
        transferFiles.rejected,
        createPhotos.matchRejected
      ),
      (state, { meta: { aborted } }) => {
        state.flowStatus = aborted ? 'idle' : 'error';
      }
    );

    builder.addMatcher(createPhotos.matchFulfilled, (state, { meta }) => {
      state.flowStatus = 'done';
      state.completedUploads = state.completedUploads.concat(state.successfulTransfers);
      meta.arg.originalArgs.forEach(({ fingerprint }) =>
        state.fingerprintsInDb.push(fingerprint)
      );
    });
  },
});

export const { uploadStarted, progressUpdated, userIsDone } = uploadSlice.actions;

// Listeners

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
  effect(action, { dispatch, getState }) {
    const files = selectUploadableFiles(getState());
    if (files.length) dispatch(transferFiles());
  },
});

startAppListening({
  actionCreator: transferFiles.fulfilled,
  effect(action, { dispatch, getState }) {
    const files = selectTransferredFiles(getState()) as UplaodableFileMeta[];
    const queryArg = files.map(({ fingerprint, exif }) => ({ fingerprint, ...exif }));
    dispatch(createPhotos.initiate(queryArg));
  },
});

startAppListening({
  actionCreator: fileRemoved,
  effect({ payload }, { getOriginalState }) {
    const prevFiles = selectFiles(getOriginalState());
    const removedFile = prevFiles.find(({ id }) => id === payload);
    if (removedFile) URL.revokeObjectURL(removedFile.objectURL);
  },
});

startAppListening({
  actionCreator: userIsDone,
  effect(action, { getState }) {
    const files = selectFiles(getState());
    files.forEach(({ objectURL }) => {
      URL.revokeObjectURL(objectURL);
    });
  },
});
