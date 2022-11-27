import { createAsyncThunk } from '@reduxjs/toolkit';

import { IdentityProvider } from '~/common/types';
import { loginInPopupWindow } from '~/features/me/utils';

export const loginWithProvider = createAsyncThunk(
  'loginWithProviderStatus',
  (provider: IdentityProvider) => loginInPopupWindow(provider)
);
