import { Content, Dialog } from '@adobe/react-spectrum';
import { useIntl } from 'react-intl';

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
      <Content>
        <Login onLoginButtonClick={close} />
      </Content>
    </Dialog>
  );
}
