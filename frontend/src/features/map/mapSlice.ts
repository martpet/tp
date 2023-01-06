import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { ViewState } from 'react-map-gl';
import { SetOptional } from 'type-fest';

import { startAppListening } from '~/app/store/middleware';
import { RootState } from '~/common/types';

import { MapState } from './types';
import { getMapViewFromUrl, setMapViewInUrl } from './utils';

const initialState: MapState = {
  view: getMapViewFromUrl() || {
    longitude: 14,
    latitude: 35,
    zoom: 1.3,
    bearing: 0,
    pitch: 0,
  },
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    mapLoaded() {},

    mapMoved(state, { payload }: PayloadAction<SetOptional<ViewState, 'padding'>>) {
      delete payload.padding;
      state.view = payload;
    },
  },
});

export const { mapLoaded, mapMoved } = mapSlice.actions;

// Selectors

export const selectMapView = (state: RootState) => state.map.view;

// Listeners

startAppListening({
  matcher: isAnyOf(mapMoved, mapLoaded),
  effect(_, { getState }) {
    setMapViewInUrl(getState().map.view);
  },
});
