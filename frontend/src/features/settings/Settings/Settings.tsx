import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const promise = import('./SettingsContent/SettingsContent');
const SettingsContent = lazy(() => promise);

export function Settings() {
  return (
    <Suspense fallback={<LoadingOverlay transparent />}>
      <SettingsContent />
    </Suspense>
  );
}
