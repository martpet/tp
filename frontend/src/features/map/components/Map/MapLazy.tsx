import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const mapImport = import('./Map');
const Map = lazy(() => mapImport);

export function MapLazy() {
  return (
    <Suspense fallback={<Loading />}>
      <Map />
    </Suspense>
  );
}
