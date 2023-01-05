import { ViewState } from 'react-map-gl';

export type MapState = {
  view: Omit<ViewState, 'padding'>;
};
