import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import {
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
    const abortedTransfers: string[] = [];
    const failedTransfers: string[] = [];
    const progress: Record<string, number> = {};
    let lastProgressDispatchAt = 0;

    await Promise.all(
      files.map(async ({ fingerprint, objectURL }) => {
        const { url, fields } = presignedPosts[fingerprint];
        const form = new FormData();
        const blob = await fetch(objectURL).then((r) => r.blob());
        const xhr = new XMLHttpRequest();

        Object.entries(fields).forEach((entry) => form.append(...entry));
        form.append('file', blob);

        return new Promise<void>((resolve) => {
          xhr.onload = () => {
            if (xhr.status === 204) {
              successfulTransfers.push(fingerprint);
            } else {
              failedTransfers.push(fingerprint);
            }
            resolve();
          };

          xhr.upload.onabort = () => {
            abortedTransfers.push(fingerprint);
            resolve();
          };

          xhr.upload.onprogress = ({ loaded, total }) => {
            progress[fingerprint] = (loaded / total) * 100;
            const now = Number(new Date());
            if (lastProgressDispatchAt < now - 500) {
              lastProgressDispatchAt = now;
              dispatch(progressUpdated({ ...progress }));
            }
          };

          const onerror = () => {
            failedTransfers.push(fingerprint);
            resolve();
          };

          xhr.upload.onerror = onerror;
          xhr.onerror = onerror;
          xhr.open('POST', url);
          xhr.send(form);
        });
      })
    );

    return {
      successfulTransfers,
      abortedTransfers,
      failedTransfers,
    };
  }
);
