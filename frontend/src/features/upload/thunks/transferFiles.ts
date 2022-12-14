import { createAsyncThunk } from '@reduxjs/toolkit';

import { addAppListener } from '~/app/store/middleware';
import { RootState } from '~/common/types';
import {
  removeFile,
  selectFilesPendingTransfer,
  selectPresignedPosts,
  transferCompleted,
  transferFailed,
  transfersProgressUpdated,
} from '~/features/upload';

export const transferFiles = createAsyncThunk(
  'upload/filesTransferStatus',
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    const files = selectFilesPendingTransfer(state);
    const presignedPosts = selectPresignedPosts(state);
    const requests: Record<string, XMLHttpRequest> = {};
    const progress: Record<string, number> = {};
    const isFirefox = navigator.userAgent.includes('Firefox');
    let lastProgressDispatchAt = 0;

    const unsubscribeFileRemovedListener = dispatch(
      addAppListener({
        actionCreator: removeFile.fulfilled,
        effect({ payload }) {
          requests[payload].abort();
        },
      })
    );

    const offlineEventListener = () => {
      // This aborts xhr upload requests in Firefox when network is down.
      // By default:
      // - Safari aborts all active/pending requests when network goes down.
      // - Chrome aborts pending requests, waits for network to go up and resumes active requests.
      // - Firefox does not abort any requests, neither resumes them.
      if (isFirefox) {
        Object.values(requests).forEach((xhr) => xhr.abort());
      }
    };

    window.addEventListener('offline', offlineEventListener);

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
            dispatch(transferFailed(id));
            resolve();
          };

          xhr.upload.onprogress = ({ loaded, total }) => {
            const now = Date.now();
            progress[id] = Math.floor((loaded / total) * 100);
            if (lastProgressDispatchAt < now - 250) {
              lastProgressDispatchAt = now;
              dispatch(transfersProgressUpdated({ ...progress }));
            }
          };

          xhr.open('POST', url);
          xhr.send(form);
        });
      })
    );

    // @ts-ignore
    unsubscribeFileRemovedListener();

    window.removeEventListener('offline', offlineEventListener);
  }
);
