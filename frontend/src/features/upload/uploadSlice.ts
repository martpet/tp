import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import { RootState } from '~/common/types';
import { createPhotos } from '~/features/photos';
import {
  addFiles,
  createUploadUrls,
  FileMeta,
  removeFile,
  selectFiles,
  selectFilesPendingCreation,
  selectFilesPendingTransfer,
  transferFiles,
  UplaodableFileMeta,
} from '~/features/upload';

export type UploadState = {
  flowStatus: 'idle' | 'pending' | 'transferring' | 'creatingPhotos' | 'done' | 'error';
  files: FileMeta[];
  isAddingFiles: boolean;
  presignedPosts: Record<string, PresignedPost>;
  fingerprintsInDb: string[];
  transfersProgress: Record<string, number>;
  successfulTransfers: string[];
  failedTransfers: string[];
  completedUploads: string[];
  pendingFileRemovals: string[];
};

const initialState: UploadState = {
  flowStatus: 'idle',
  files: [],
  isAddingFiles: false,
  presignedPosts: {},
  fingerprintsInDb: [],
  transfersProgress: {},
  successfulTransfers: [],
  failedTransfers: [],
  completedUploads: [],
  pendingFileRemovals: [],
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    uploadFlowStarted(state) {
      state.flowStatus = 'pending';
      state.failedTransfers = [];
      state.transfersProgress = Object.fromEntries(
        state.successfulTransfers.map((id) => [id, 100])
      );
    },
    progressUpdated(state, { payload }: PayloadAction<Record<string, number>>) {
      Object.assign(state.transfersProgress, payload);
    },
    transferCompleted(state, { payload }: PayloadAction<string>) {
      state.successfulTransfers.push(payload);
      state.transfersProgress[payload] = 100;
    },
    transferFailed(state, { payload }: PayloadAction<string>) {
      state.failedTransfers.push(payload);
    },
    userIsDone() {
      return initialState;
    },
  },
  extraReducers({ addCase, addMatcher }) {
    addCase(addFiles.pending, (state) => {
      state.isAddingFiles = true;
    });
    addCase(addFiles.fulfilled, (state, { payload }) => {
      state.isAddingFiles = false;
      state.files = state.files.concat(payload);
    });
    addCase(removeFile.pending, (state, { meta }) => {
      state.pendingFileRemovals.push(meta.arg);
    });
    addCase(removeFile.fulfilled, (state, { payload }) => {
      state.files = state.files.filter(({ id }) => id !== payload);
      state.pendingFileRemovals = state.pendingFileRemovals.filter(
        (id) => id !== payload
      );
      if (!state.files.length) state.flowStatus = 'idle';
    });
    addCase(transferFiles.pending, (state) => {
      state.flowStatus = 'transferring';
    });
    addCase(transferFiles.fulfilled, (state) => {
      const filesPendingCreation = selectFilesPendingCreation({
        upload: state,
      } as RootState);

      if (state.files.length && !filesPendingCreation.length) {
        state.flowStatus = 'done';
      }
    });
    addMatcher(createUploadUrls.matchFulfilled, (state, { payload }) => {
      state.presignedPosts = payload.presignedPosts;
      if (!Object.keys(state.presignedPosts).length) {
        state.flowStatus = 'done';
      }
      state.fingerprintsInDb = state.fingerprintsInDb.concat(
        payload.existingFingerprintsInDb
      );
    });
    addMatcher(createPhotos.matchPending, (state) => {
      state.flowStatus = 'creatingPhotos';
    });
    addMatcher(createPhotos.matchFulfilled, (state, { meta }) => {
      const fingerprints = meta.arg.originalArgs.map(({ fingerprint }) => fingerprint);
      state.fingerprintsInDb = state.fingerprintsInDb.concat(fingerprints);
      state.completedUploads = state.successfulTransfers;
      state.flowStatus = 'done';
    });
    addMatcher(
      isAnyOf(
        createUploadUrls.matchRejected,
        transferFiles.rejected,
        createPhotos.matchRejected
      ),
      (state, { meta: { aborted } }) => {
        state.flowStatus = aborted ? 'idle' : 'error';
      }
    );
  },
});

export const {
  uploadFlowStarted,
  progressUpdated,
  transferCompleted,
  transferFailed,
  userIsDone,
} = uploadSlice.actions;

// Listeners

startAppListening({
  actionCreator: uploadFlowStarted,
  effect(action, { dispatch, getState }) {
    const files = selectFilesPendingTransfer(getState());
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
    const files = selectFilesPendingTransfer(getState());
    if (files.length) dispatch(transferFiles());
  },
});

startAppListening({
  actionCreator: transferFiles.fulfilled,
  effect(action, { dispatch, getState }) {
    const files = selectFilesPendingCreation(getState()) as UplaodableFileMeta[];
    if (files.length) {
      const queryArg = files.map(({ fingerprint, exif }) => ({ fingerprint, ...exif }));
      dispatch(createPhotos.initiate(queryArg));
    }
  },
});

startAppListening({
  actionCreator: removeFile.fulfilled,
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
