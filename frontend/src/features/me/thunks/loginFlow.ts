import { createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';

import { addAppListener } from '~/app/store/middleware';
import { appLoginDialogDismissed, loginWithProvider } from '~/features/me';

export const loginFlow = createAsyncThunk(
  'loginFlowStatus',
  (thunkArg, { dispatch }) =>
    new Promise<void>((resolve, reject) => {
      dispatch(
        addAppListener({
          matcher: isAnyOf(
            loginWithProvider.fulfilled,
            loginWithProvider.rejected,
            appLoginDialogDismissed
          ),
          effect: (action, { unsubscribe }) => {
            if (loginWithProvider.fulfilled.match(action)) {
              resolve();
            } else if (appLoginDialogDismissed.match(action)) {
              reject(Error('Login dialog dismissed'));
            } else {
              reject(Error(action.error.message));
            }
            unsubscribe();
          },
        })
      );
    })
);
