import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const promise = import('./ProfileContent');
const ProfileContent = lazy(() => promise);

export function Profile() {
  return (
    <Suspense fallback={<LoadingOverlay transparent />}>
      <ProfileContent />
    </Suspense>
  );
}
