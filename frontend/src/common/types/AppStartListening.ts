import type { TypedStartListening } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '~/common/types';

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
