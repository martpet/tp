import type { TypedAddListener } from '@reduxjs/toolkit';
import { addListener, createListenerMiddleware } from '@reduxjs/toolkit';

import { AppDispatch, AppStartListening, RootState } from '~/common/types';

const listener = createListenerMiddleware();

export const { middleware: listenerMiddleware } = listener;

export const startAppListening = listener.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;
