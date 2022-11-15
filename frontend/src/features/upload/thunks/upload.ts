import { createAsyncThunk } from '@reduxjs/toolkit';

export const upload = createAsyncThunk('upload/status', async () => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
});
