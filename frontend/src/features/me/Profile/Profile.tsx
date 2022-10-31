import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const modulePromise = import('./ProfileContent');
const ProfileContent = lazy(() => modulePromise);

export function Profile() {
  return (
    <Suspense fallback={<LoadingOverlay transparent />}>
      <ProfileContent />
    </Suspense>
  );
}
