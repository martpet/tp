import { createAsyncThunk } from '@reduxjs/toolkit';

import { addAppListener } from '~/app/store/middleware';
import { RootState } from '~/common/types';
import {
  fileRemoved,
  progressUpdated,
  selectFilesPendingTransfer,
  selectPresignedPosts,
  transferCompleted,
  transferFailed,
} from '~/features/upload';

export const transferFiles = createAsyncThunk(
  'transferFilesStatus',
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    const files = selectFilesPendingTransfer(state);
    const presignedPosts = selectPresignedPosts(state);
    const requests: Record<string, XMLHttpRequest> = {};
    const progress: Record<string, number> = {};
    let lastProgressDispatchAt = 0;

    const unsubscribeFileRemoveListener = dispatch(
      addAppListener({
        actionCreator: fileRemoved,
        effect({ payload }) {
          requests[payload].abort();
        },
      })
    );

    await Promise.allSettled(
      files.map(async ({ id, objectURL }) => {
        const { url, fields } = presignedPosts[id];
        const form = new FormData();
        const blob = await fetch(objectURL).then((r) => r.blob());
        const xhr = new XMLHttpRequest();

        requests[id] = xhr;
        Object.entries(fields).forEach((entry) => form.append(...entry));
        form.append('file', blob);

        return new Promise<void>((resolve) => {
          xhr.onload = () => {
            if (xhr.status === 204) {
              dispatch(transferCompleted(id));
            } else {
              dispatch(transferFailed(id));
            }
            resolve();
          };

          xhr.onerror = () => {
            dispatch(transferFailed(id));
            resolve();
          };

          xhr.upload.onabort = () => {
            resolve();
          };

          xhr.upload.onprogress = ({ loaded, total }) => {
            const now = Number(new Date());
            progress[id] = Math.floor((loaded / total) * 100);
            if (lastProgressDispatchAt < now - 250) {
              lastProgressDispatchAt = now;
              dispatch(progressUpdated({ ...progress }));
            }
          };

          xhr.open('POST', url);
          xhr.send(form);
        });
      })
    );

    // @ts-ignore
    unsubscribeFileRemoveListener();
  }
);
