import { Content, Flex } from '@adobe/react-spectrum';
import { isWebKit } from '@react-aria/utils';

import { LoginButton } from '~/features/me';

type Props = {
  close: () => void;
};

export default function LoginDialogContent({ close }: Props) {
  const buttons = [
    <LoginButton key="g" provider="Google" onClick={close} />,
    <LoginButton key="a" provider="SignInWithApple" onClick={close} />,
  ];

  if (isWebKit()) {
    buttons.reverse();
  }

  return (
    <Content>
      <Flex justifyContent="center">
        <Flex direction="column" gap="size-250">
          {buttons}
        </Flex>
      </Flex>
    </Content>
  );
}
