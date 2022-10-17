import { Content, Dialog } from '@adobe/react-spectrum';
import { useIntl } from 'react-intl';

import { Settings } from '~/features/settings';

export function SettingsDialog() {
  const { formatMessage } = useIntl();

  return (
    <Dialog
      size="L"
      aria-label={formatMessage({
        defaultMessage: 'Settings',
        description: 'settings dialog aria-label',
      })}
    >
      <Content>
        <Settings />
      </Content>
    </Dialog>
  );
}
