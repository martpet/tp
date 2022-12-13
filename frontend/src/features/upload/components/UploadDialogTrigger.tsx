import { DialogTrigger } from '@adobe/react-spectrum';
import { useIsMobileDevice } from '@react-spectrum/utils';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '~/common/hooks';
import { selectUploadDialogOpened, uploadDialogToggled } from '~/features/app';
import { selectUploadFlowEnded } from '~/features/upload/uploadSelectors';

type Props = {
  children: ReactNode;
};

export function UploadDialogTrigger({ children }: Props) {
  const isDialogOpen = useSelector(selectUploadDialogOpened);
  const isFlowEnded = useSelector(selectUploadFlowEnded);
  const isMobile = useIsMobileDevice();
  const dispatch = useAppDispatch();

  return (
    // @ts-ignore
    <DialogTrigger
      type={isMobile ? 'fullscreenTakeover' : 'fullscreen'}
      isOpen={isDialogOpen}
      isKeyboardDismissDisabled={isFlowEnded}
      onOpenChange={(isOpen) => dispatch(uploadDialogToggled(isOpen))}
    >
      {children}
    </DialogTrigger>
  );
}
