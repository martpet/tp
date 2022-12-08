import { createAsyncThunk } from '@reduxjs/toolkit';

import { addAppListener } from '~/app/store/middleware';
import { RootState } from '~/common/types';
import {
  fileRemoved,
  progressUpdated,
  selectPresignedPosts,
  selectUploadableFiles,
} from '~/features/upload';

export const transferFiles = createAsyncThunk(
  'transferFilesStatus',
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    const files = selectUploadableFiles(state);
    const presignedPosts = selectPresignedPosts(state);
    const successfulTransfers: string[] = [];
    const failedTransfers: string[] = [];
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

    await Promise.all(
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
              successfulTransfers.push(id);
            } else {
              failedTransfers.push(id);
            }
            resolve();
          };

          const onerror = () => {
            failedTransfers.push(id);
            resolve();
          };

          xhr.upload.onabort = () => {
            resolve();
          };

          xhr.upload.onprogress = ({ loaded, total }) => {
            progress[id] = Math.floor((loaded / total) * 100);
            const now = Number(new Date());
            if (lastProgressDispatchAt < now - 250) {
              lastProgressDispatchAt = now;
              dispatch(progressUpdated({ ...progress }));
            }
          };

          xhr.upload.onerror = onerror;
          xhr.onerror = onerror;
          xhr.open('POST', url);
          xhr.send(form);
        });
      })
    );

    dispatch(progressUpdated(progress));
    // @ts-ignore
    unsubscribeFileRemoveListener();

    return {
      successfulTransfers,
      failedTransfers,
    };
  }
);
