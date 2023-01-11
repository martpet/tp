import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const Map = lazy(() => import('./Map'));

export function MapLazy() {
  return (
    <Suspense fallback={<Loading />}>
      <Map />
    </Suspense>
  );
}
