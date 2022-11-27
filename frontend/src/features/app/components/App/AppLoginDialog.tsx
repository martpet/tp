import { DialogContainer } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '~/common/hooks';
import {
  appLoginDialogDismissed,
  LoginDialog,
  selectIsAppLoginDialogOpen,
} from '~/features/me';

export function AppLoginDialog() {
  const isOpen = useSelector(selectIsAppLoginDialogOpen);
  const dispatch = useAppDispatch();

  const handleDismiss = () => {
    dispatch(appLoginDialogDismissed());
  };

  return (
    <DialogContainer onDismiss={handleDismiss} type="modal" isDismissable>
      {isOpen && <LoginDialog />}
    </DialogContainer>
  );
}
