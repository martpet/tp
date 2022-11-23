import { Dialog } from '@adobe/react-spectrum';
import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const modulePromise = import('./UploadDialogInner/UploadDialogInner');
const UploadDialogInner = lazy(() => modulePromise);

export function UploadDialog() {
  return (
    <Dialog>
      <Suspense fallback={<LoadingOverlay transparent />}>
        <UploadDialogInner />
      </Suspense>
    </Dialog>
  );
}
