import { Dialog } from '@adobe/react-spectrum';
import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

const promise = import('./LoginDialogContent');
const LoginDialogContent = lazy(() => promise);

type Props = {
  close: () => void;
};

export function LoginDialog({ close }: Props) {
  return (
    <Dialog size="S">
      <Suspense fallback={<LoadingOverlay transparent />}>
        <LoginDialogContent close={close} />
      </Suspense>
    </Dialog>
  );
}
