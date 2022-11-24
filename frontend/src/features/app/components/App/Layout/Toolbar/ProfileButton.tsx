// TODO: Add tooltip to ActionButton when fixed: https://github.com/adobe/react-spectrum/issues/3009

import { ActionButton, DialogTrigger } from '@adobe/react-spectrum';
import ProfileIcon from '@spectrum-icons/workflow/RealTimeCustomerProfile';
import { useIntl } from 'react-intl';

import { Avatar, Spinner } from '~/common/components';
import { useAppSelector } from '~/common/hooks';
import { LoginDialog, ProfileDialog, selectIsLoadingMe, selectMe } from '~/features/me';

export function ProfileButton() {
  const { formatMessage } = useIntl();
  const me = useAppSelector(selectMe);
  const isLoadingMe = useAppSelector(selectIsLoadingMe);

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
        {isLoadingMe ? <Spinner size="S" /> : <ProfileIcon />}
      </ActionButton>
      {(close) => <LoginDialog close={close} />}
    </DialogTrigger>
  );
}
