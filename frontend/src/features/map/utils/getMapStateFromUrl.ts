import { MapState, MapStateUrlParam } from '~/features/map';

type MapStateFromUrl = Partial<Pick<MapState, 'view'>>;

export const getMapStateFromUrl = (): MapStateFromUrl => {
  const url = new URL(window.location.href);
  const urlParams = Object.fromEntries(url.searchParams);
  const result: MapStateFromUrl = {};

  const values = {
    lon: Number(urlParams.lon),
    lat: Number(urlParams.lat),
    bearing: Number(urlParams.bearing),
    zoom: Number(urlParams.zoom),
    pitch: Number(urlParams.pitch),
  } satisfies Record<MapStateUrlParam, unknown>;

  const view = {
    longitude: values.lon,
    latitude: values.lat,
    bearing: values.bearing,
    zoom: values.zoom,
    pitch: values.pitch,
  };

  if (Object.values(view).some((val) => val)) {
    result.view = view;
  }

  return result;
};
