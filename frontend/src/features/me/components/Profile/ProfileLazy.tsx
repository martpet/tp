import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const profileImport = import('./Profile');
const Profile = lazy(() => profileImport);

export function ProfileLazy() {
  return (
    <Suspense fallback={<Loading />}>
      <Profile />
    </Suspense>
  );
}
