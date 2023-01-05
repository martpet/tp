import { toFixedGeoNumber } from '~/common/utils';
import { MapState, MapStateUrlParam } from '~/features/map';

export const setMapStateInUrl = ({ view }: MapState) => {
  const urlParams = {
    lon: toFixedGeoNumber('longitude', view.longitude),
    lat: toFixedGeoNumber('latitude', view.latitude),
    bearing: toFixedGeoNumber('bearing', view.bearing),
    zoom: toFixedGeoNumber('zoom', view.zoom),
    pitch: toFixedGeoNumber('pitch', view.pitch),
  } satisfies Record<MapStateUrlParam, unknown>;

  const url = new URL(window.location.href);

  Object.entries(urlParams).forEach(([key, val]) => {
    if (val) url.searchParams.set(key, String(val));
  });

  window.history.replaceState(null, '', url);
};
