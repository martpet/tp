import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const profileImport = import('./ProfileInner/ProfileInner');
const ProfileInner = lazy(() => profileImport);

export function Profile() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileInner />
    </Suspense>
  );
}
