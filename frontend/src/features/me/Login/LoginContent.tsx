import { Flex } from '@adobe/react-spectrum';
import { isWebKit } from '@react-aria/utils';

import { LoginButton } from '~/features/me';

type Props = {
  onLoginButtonClick?: () => void;
};

export default function LoginContent({ onLoginButtonClick }: Props) {
  const handleButtonClick = () => {
    if (onLoginButtonClick) {
      onLoginButtonClick();
    }
  };

  const buttons = [
    <LoginButton key="g" provider="Google" onClick={handleButtonClick} />,
    <LoginButton key="a" provider="SignInWithApple" onClick={handleButtonClick} />,
  ];

  if (isWebKit()) {
    buttons.reverse();
  }

  return (
    <Flex justifyContent="center">
      <Flex direction="column" gap="size-250">
        {buttons}
      </Flex>
    </Flex>
  );
}
