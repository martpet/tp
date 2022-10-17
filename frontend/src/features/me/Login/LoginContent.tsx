import { Flex } from '@adobe/react-spectrum';
import { isWebKit } from '@react-aria/utils';

import adobeCleanBold from '~/assets/fonts/AdobeClean-Bold.woff2';
import googleLogo from '~/assets/google-logo.svg';
import { LoginButton } from '~/features/me';

// Preload assets after LoginContent is lazy loaded
document.head.insertAdjacentHTML(
  'beforeend',
  `<link 
    rel="preload" 
    href="${googleLogo}"
    as="image"
    type="image/svg+xml" />

  <link
    rel="preload" 
    href="${adobeCleanBold}" 
    as="font" 
    type="font/woff2"
    crossorigin />`
);

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
