import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const modulePromise = import('./UploadContent/UploadContent');
const UploadContent = lazy(() => modulePromise);

export function Upload() {
  return (
    <Suspense fallback={<LoadingOverlay transparent />}>
      <UploadContent />
    </Suspense>
  );
}
