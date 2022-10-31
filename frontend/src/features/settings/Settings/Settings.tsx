import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const modulePromise = import('./SettingsContent/SettingsContent');
const SettingsContent = lazy(() => modulePromise);

export function Settings() {
  return (
    <Suspense fallback={<LoadingOverlay transparent />}>
      <SettingsContent />
    </Suspense>
  );
}
