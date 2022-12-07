import { Flex } from '@adobe/react-spectrum';
import { isWebKit } from '@react-aria/utils';

import adobeCleanBold from '~/assets/fonts/AdobeClean-Bold.woff2';
import googleLogo from '~/assets/google-logo.svg';
import { Spinner } from '~/common/components';
import { useAppSelector } from '~/common/hooks';
import { selectIsLoadingMe } from '~/features/me/meSlice';

import { LoginButton } from './LoginButton';

// Preload assets after LoginInner is lazy loaded;
// `adobeCleanBold` font used only in this component.
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

export default function LoginInner({ onLoginButtonClick }: Props) {
  const isLoadingMe = useAppSelector(selectIsLoadingMe);

  const handleButtonClick = () => {
    if (onLoginButtonClick) {
      onLoginButtonClick();
    }
  };

  const loginButtons = [
    <LoginButton key="g" provider="Google" onClick={handleButtonClick} />,
    <LoginButton key="a" provider="SignInWithApple" onClick={handleButtonClick} />,
  ];

  if (isWebKit()) {
    loginButtons.reverse();
  }

  return (
    <Flex justifyContent="center" alignItems="center" UNSAFE_style={{ height: '100%' }}>
      {isLoadingMe ? (
        <Spinner />
      ) : (
        <Flex direction="column" gap="size-250">
          {loginButtons}
        </Flex>
      )}
    </Flex>
  );
}
