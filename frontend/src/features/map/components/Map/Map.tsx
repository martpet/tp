import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const mapImport = import('./MapInner');
const MapInner = lazy(() => mapImport);

export function Map() {
  return (
    <Suspense fallback={<Loading />}>
      <MapInner />
    </Suspense>
  );
}
