import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const modulePromise = import('./ProfileInner/ProfileInner');
const ProfileInner = lazy(() => modulePromise);

export function Profile() {
  return (
    <Suspense fallback={<LoadingOverlay transparent />}>
      <ProfileInner />
    </Suspense>
  );
}
