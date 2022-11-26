import {
  Content,
  Dialog,
  Divider,
  Heading,
  useDialogContainer,
  View,
} from '@adobe/react-spectrum';
import { FormattedMessage, useIntl } from 'react-intl';

import { Login } from '~/features/me';

export function LoginDialog() {
  const { formatMessage } = useIntl();
  const dialog = useDialogContainer();

  return (
    <Dialog
      size="S"
      aria-label={formatMessage({
        defaultMessage: 'Login',
        description: 'login dialog aria-label',
      })}
    >
      <Heading>
        <FormattedMessage defaultMessage="Log In" description="login dialog heading" />
      </Heading>
      <Divider />
      <Content>
        <View>
          <Login onLoginButtonClick={dialog.dismiss} />
        </View>
      </Content>
    </Dialog>
  );
}
