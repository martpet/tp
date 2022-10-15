import { Button } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import { apiPaths, apiUrl } from '~/common/consts';

type Props = {
  onClick?: () => void;
};

export function LogoutButton({ onClick }: Props) {
  const handleClick = async () => {
    if (onClick) {
      onClick();
    }
    window.location.href = apiUrl + apiPaths.logout;
  };
  return (
    <Button variant="secondary" onPress={handleClick}>
      <FormattedMessage defaultMessage="Sign Out" description="logout button" />
    </Button>
  );
}
