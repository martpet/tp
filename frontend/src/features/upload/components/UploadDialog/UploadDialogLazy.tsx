import { Dialog } from '@adobe/react-spectrum';
import { lazy, Suspense } from 'react';

import { Loading } from '~/common/components';

const uploadDialogImport = import('./UploadDialog/UploadDialog');
const UploadDialog = lazy(() => uploadDialogImport);

export function UploadDialogLazy() {
  return (
    <Dialog>
      <Suspense fallback={<Loading />}>
        <UploadDialog />
      </Suspense>
    </Dialog>
  );
}
