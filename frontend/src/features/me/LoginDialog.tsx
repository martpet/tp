import { Content, Dialog, Divider, Heading } from '@adobe/react-spectrum';
import { FormattedMessage, useIntl } from 'react-intl';

import { Login } from '~/features/me';

type Props = {
  close: () => void;
};

export function LoginDialog({ close }: Props) {
  const { formatMessage } = useIntl();

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
        <Login onLoginButtonClick={close} />
      </Content>
    </Dialog>
  );
}
