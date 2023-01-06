import { Entries } from 'type-fest';

import { toFixedGeoNumber } from '~/common/utils';
import { MapState } from '~/features/map';

const urlParam = 'map';
const separator = ',';

const keys: Record<string, keyof MapState['view']> = {
  b: 'bearing',
  z: 'zoom',
  p: 'pitch',
};

const keysRegExp = new RegExp(
  Object.keys(keys)
    .map((key) => `${key}$`)
    .join('|')
);

export const getMapViewFromUrl = () => {
  const url = new URL(window.location.href);
  const queryString = url.searchParams.get(urlParam);
  if (!queryString) {
    return undefined;
  }
  const [lon, lat, ...parts] = queryString.split(separator);
  const view: Partial<MapState['view']> = {
    longitude: Number(lon),
    latitude: Number(lat),
  };
  parts.forEach((part) => {
    const match = part.match(keysRegExp);
    if (match) {
      const [key] = match;
      const val = part.slice(0, part.length - 1);
      const fullKey = keys[key];
      view[fullKey] = Number(val);
    }
  });
  return view;
};

export const setMapViewInUrl = (view: MapState['view']) => {
  const stringItems = [
    String(toFixedGeoNumber('longitude', view.longitude)),
    String(toFixedGeoNumber('latitude', view.latitude)),
  ];
  const viewEntries = Object.entries(view) as Entries<typeof view>;
  viewEntries.forEach(([key, val]) => {
    if (key === 'longitude' || key === 'latitude') {
      return;
    }
    const shortKey = Object.entries(keys).find(([, v]) => v === key)?.[0];
    const fixedNumber = toFixedGeoNumber(key, val);
    if (fixedNumber) {
      stringItems.push(`${String(fixedNumber)}${shortKey}`);
    }
  });
  const url = new URL(window.location.href);
  url.searchParams.set(urlParam, stringItems.join(separator));
  url.search = decodeURIComponent(url.search);
  window.history.replaceState(null, '', url);
};
