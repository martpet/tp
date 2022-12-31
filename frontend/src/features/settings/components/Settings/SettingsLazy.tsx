import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const settingsImport = import('./Settings/Settings');
const Settings = lazy(() => settingsImport);

export function SettingsLazy() {
  return (
    <Suspense fallback={<Loading />}>
      <Settings />
    </Suspense>
  );
}
