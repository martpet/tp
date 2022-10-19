import { Button } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import { persistor } from '~/app/store';
import { apiPaths, apiUrl } from '~/common/consts';

export function LogoutButton() {
  const handleClick = async () => {
    await persistor.purge();
    window.location.href = apiUrl + apiPaths.logout;
  };
  return (
    <Button variant="secondary" onPress={handleClick}>
      <FormattedMessage defaultMessage="Sign Out" description="logout button" />
    </Button>
  );
}
