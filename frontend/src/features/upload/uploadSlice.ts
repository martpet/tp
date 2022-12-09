import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import {
  addFiles,
  createUploadUrls,
  FileMeta,
  fileRemoved,
  selectFiles,
  selectUploadableFiles,
  transferFiles,
} from '~/features/upload';

export type UploadState = {
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
