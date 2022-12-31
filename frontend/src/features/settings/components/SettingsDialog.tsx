import {
  Content,
  Dialog,
  Divider,
  Heading,
  useDialogContainer,
} from '@adobe/react-spectrum';
import { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { useToolbarPosition } from '~/common/hooks';
import { SettingsLazy } from '~/features/settings';

export function SettingsDialog() {
  const { type: dialogType, dismiss: closeDialog } = useDialogContainer();
  const { toolbarPosition } = useToolbarPosition();
  const prevToolbarPosition = useRef(toolbarPosition);
  const isToolbarPositionChanged = toolbarPosition !== prevToolbarPosition.current;
  const isPopoverDialog = dialogType === 'popover';

  useEffect(() => {
    if (isToolbarPositionChanged && isPopoverDialog) {
      closeDialog();
    }
  }, [isToolbarPositionChanged]);

  return (
    <Dialog size="L">
      <Heading>
        <FormattedMessage
          defaultMessage="Settings"
          description="settings dialog heading"
        />
      </Heading>
      <Divider />
      <Content>
        <SettingsLazy />
      </Content>
    </Dialog>
  );
}
