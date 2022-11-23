import { Content, Dialog } from '@adobe/react-spectrum';
import { useIntl } from 'react-intl';

import { Profile } from './Profile/Profile';

export function ProfileDialog() {
  const { formatMessage } = useIntl();

  return (
    <Dialog
      aria-label={formatMessage({
        defaultMessage: 'Profile',
        description: 'profile dialog aria-label',
      })}
    >
      <Content>
        <Profile />
      </Content>
    </Dialog>
  );
}
