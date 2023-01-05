import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { LngLat } from 'maplibre-gl';
import { ViewState } from 'react-map-gl';
import { SetOptional } from 'type-fest';

import { startAppListening } from '~/app/store/middleware';
import { RootState } from '~/common/types';

import { MapState } from './types';
import { getMapStateFromUrl, setMapStateInUrl } from './utils';

const initialState: MapState = {
  view: getMapStateFromUrl().view || {
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
      const [longitude, latitude] = new LngLat(payload.longitude, payload.latitude)
        .wrap()
        .toArray();
      state.view = {
        ...payload,
        longitude,
        latitude,
      };
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
    setMapStateInUrl(getState().map);
  },
});
