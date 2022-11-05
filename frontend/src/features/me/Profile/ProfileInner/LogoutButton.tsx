import { Button } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import { useAppDispatch } from '~/common/hooks';
import { signedOut } from '~/features/me/meSlice';

export function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(signedOut());
  };

  return (
    <Button variant="secondary" onPress={handleClick}>
      <FormattedMessage defaultMessage="Sign Out" description="logout button" />
    </Button>
  );
}
