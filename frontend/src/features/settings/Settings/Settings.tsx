import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const modulePromise = import('./SettingsInner/SettingsInner');
const SettingsInner = lazy(() => modulePromise);

export function Settings() {
  return (
    <Suspense fallback={<LoadingOverlay transparent />}>
      <SettingsInner />
    </Suspense>
  );
}
