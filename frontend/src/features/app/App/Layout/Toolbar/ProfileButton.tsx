// TODO: Add tooltip to ActionButton when fixed: https://github.com/adobe/react-spectrum/issues/3009

import { ActionButton, DialogTrigger } from '@adobe/react-spectrum';
import ProfileIcon from '@spectrum-icons/workflow/RealTimeCustomerProfile';
import { useIntl } from 'react-intl';

import { Avatar } from '~/common/components';
import { LoginDialog, ProfileDialog, useMe } from '~/features/me';

export function ProfileButton() {
  const { formatMessage } = useIntl();
  const { me } = useMe();

  const buttonAriaLabel = formatMessage({
    defaultMessage: 'Profile',
    description: 'toolbar profile button aria label',
  });

  if (me) {
    return (
      <DialogTrigger type="popover">
        <ActionButton isQuiet aria-label={buttonAriaLabel}>
          <Avatar user={me} spectrumProps={{ marginX: 6 }} />
        </ActionButton>
        <ProfileDialog />
      </DialogTrigger>
    );
  }

  return (
    <DialogTrigger type="popover">
      <ActionButton isQuiet aria-label={buttonAriaLabel}>
        <ProfileIcon />
      </ActionButton>
      {(close) => <LoginDialog close={close} />}
    </DialogTrigger>
  );
}
