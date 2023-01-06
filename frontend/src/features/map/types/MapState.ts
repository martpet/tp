import { ViewState } from 'react-map-gl';

export type MapState = {
  view: Partial<Omit<ViewState, 'padding'>>;
};
