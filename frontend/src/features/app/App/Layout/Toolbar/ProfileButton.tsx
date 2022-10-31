// TODO: Add tooltip to ActionButton when fixed: https://github.com/adobe/react-spectrum/issues/3009

import { ActionButton, DialogTrigger } from '@adobe/react-spectrum';
import ProfileIcon from '@spectrum-icons/workflow/RealTimeCustomerProfile';
import { useIntl } from 'react-intl';

import { Avatar } from '~/common/components';
import { useAppSelector } from '~/common/hooks';
import { LoginDialog, ProfileDialog, selectMe } from '~/features/me';

export function ProfileButton() {
  const me = useAppSelector(selectMe);
  const { formatMessage } = useIntl();

  const buttonAriaLabel = formatMessage({
    defaultMessage: 'Profile',
    description: 'toolbar profile button aria label',
  });

  if (me) {
    return (
      <DialogTrigger type="popover">
        <ActionButton isQuiet aria-label={buttonAriaLabel}>
          <Avatar user={me} />
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
