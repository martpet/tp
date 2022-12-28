import { Dialog } from '@adobe/react-spectrum';
import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const uploadDialogImport = import('./UploadDialogInner/UploadDialogInner');
const UploadDialogInner = lazy(() => uploadDialogImport);

export function UploadDialog() {
  return (
    <Dialog>
      <Suspense fallback={<Loading />}>
        <UploadDialogInner />
      </Suspense>
    </Dialog>
  );
}
