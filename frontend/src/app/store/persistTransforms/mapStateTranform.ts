import { createTransform } from 'redux-persist';

import { getMapStateFromUrl, MapState } from '~/features/map';

export const mapViewTransform = createTransform(
  undefined,
  (view) => {
    const { view: viewFromUrl } = getMapStateFromUrl();

    if (viewFromUrl) {
      console.log('----------');
      return viewFromUrl;
    }

    console.log(view);

    return view;
  },
  { whitelist: <(keyof MapState)[]>['view'] }
);
