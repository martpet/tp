import {
  Content,
  Dialog,
  Divider,
  Heading,
  useDialogContainer,
  View,
} from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import { LoginLazy } from '~/features/me';

type Props = {
  dismissOnLoginClick?: boolean;
};

export function LoginDialog({ dismissOnLoginClick }: Props) {
  const dialog = useDialogContainer();

  const onLoginButtonClick = () => {
    if (dismissOnLoginClick) {
      dialog.dismiss();
    }
  };

  return (
    <Dialog size="S">
      <Heading>
        <FormattedMessage defaultMessage="Log In" description="login dialog heading" />
      </Heading>
      <Divider />
      <Content>
        <View marginTop="size-50">
          <LoginLazy onLoginButtonClick={onLoginButtonClick} />
        </View>
      </Content>
    </Dialog>
  );
}
