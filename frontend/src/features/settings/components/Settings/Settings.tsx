import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const settingsImport = import('./SettingsInner/SettingsInner');
const SettingsInner = lazy(() => settingsImport);

export function Settings() {
  return (
    <Suspense fallback={<Loading />}>
      <SettingsInner />
    </Suspense>
  );
}
