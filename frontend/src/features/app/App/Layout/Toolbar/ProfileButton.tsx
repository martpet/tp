import { ActionButton, DialogTrigger } from '@adobe/react-spectrum';
import ProfileIcon from '@spectrum-icons/workflow/RealTimeCustomerProfile';
import { useIntl } from 'react-intl';

import { Avatar } from '~/common/components';
import { useAppSelector } from '~/common/hooks';
import { LoginDialog, ProfileDialog, selectMe } from '~/features/me';

export function ProfileButton() {
  const me = useAppSelector(selectMe);
  const { formatMessage } = useIntl();

  const buttonLabel = formatMessage({
    defaultMessage: 'Profile',
    description: 'toolbar profile button aria label',
  });

  if (me) {
    return (
      <DialogTrigger type="popover">
        <ActionButton isQuiet aria-label={buttonLabel}>
          <Avatar user={me} />
        </ActionButton>
        {(close) => <ProfileDialog close={close} />}
      </DialogTrigger>
    );
  }

  return (
    <DialogTrigger type="popover">
      <ActionButton isQuiet aria-label={buttonLabel}>
        <ProfileIcon />
      </ActionButton>
      {(close) => <LoginDialog close={close} />}
    </DialogTrigger>
  );
}

// TODO: add tooltip to buttons when issue fixed: https://github.com/adobe/react-spectrum/issues/3009
