// TODO: Add tooltip to ActionButton when fixed: https://github.com/adobe/react-spectrum/issues/3009

import { ActionButton, DialogTrigger } from '@adobe/react-spectrum';
import SettingsIcon from '@spectrum-icons/workflow/Settings';
import { useIntl } from 'react-intl';

import { SettingsDialog } from '~/features/settings';

export function SettingsButton() {
  const { formatMessage } = useIntl();

  return (
    <DialogTrigger type="popover">
      <ActionButton
        isQuiet
        aria-label={formatMessage({
          defaultMessage: 'Settings',
          description: 'toolbar settings button aria label',
        })}
      >
        <SettingsIcon />
      </ActionButton>
      <SettingsDialog />
    </DialogTrigger>
  );
}
