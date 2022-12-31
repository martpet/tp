import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LngLat } from 'maplibre-gl';
import { ViewState } from 'react-map-gl';
import { SetOptional } from 'type-fest';

import { RootState } from '~/common/types';

export type MapState = {
  view: Omit<ViewState, 'padding'>;
};

const initialState: MapState = {
  view: {
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  },
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
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

export const { mapMoved } = mapSlice.actions;

export const selectMapView = (state: RootState) => state.map.view;
