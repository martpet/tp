import { createTransform } from 'redux-persist';

import { getMapViewFromUrl, MapState } from '~/features/map';

export const mapViewTransform = createTransform(
  undefined,
  (view) => {
    const viewFromUrl = getMapViewFromUrl();

    if (viewFromUrl) {
      return viewFromUrl;
    }

    return view;
  },
  { whitelist: <(keyof MapState)[]>['view'] }
);
