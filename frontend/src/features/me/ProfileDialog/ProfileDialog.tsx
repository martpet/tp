import { Dialog } from '@adobe/react-spectrum';
import { lazy, Suspense } from 'react';

import { LoadingOverlay } from '~/common/components';

type Props = {
  close?: () => void;
};

const ProfileDialogContent = lazy(() => import('./ProfileDialogContent'));

export function ProfileDialog({ close }: Props) {
  return (
    <Dialog>
      <Suspense fallback={<LoadingOverlay transparent />}>
        <ProfileDialogContent close={close} />
      </Suspense>
    </Dialog>
  );
}
