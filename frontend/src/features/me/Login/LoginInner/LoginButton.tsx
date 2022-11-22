import { Button, View } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import googleLogo from '~/assets/google-logo.svg';
import { IdentityProvider } from '~/common/types';

import { useLoginPopup } from '../useLoginPopup';

type Props = {
  provider: IdentityProvider;
  onClick?: () => void;
};

export function LoginButton({ provider, onClick }: Props) {
  const loginWithPopup = useLoginPopup();
  const appleIcon = '';

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    loginWithPopup(provider);
  };

  return (
    <Button
      variant="primary"
      onPress={handleClick}
      UNSAFE_style={{ paddingInline: '2em' }}
    >
      {provider === 'SignInWithApple' && (
        <>
          <View marginEnd="static-size-125" UNSAFE_style={{ fontSize: '1.3em' }}>
            {appleIcon}
          </View>
          <FormattedMessage
            defaultMessage="Continue with Apple"
            description="apple login button"
          />
        </>
      )}

      {provider === 'Google' && (
        <>
          <View marginEnd="static-size-100">
            <img
              src={googleLogo}
              alt=""
              role="presentation"
              style={{ width: '1em', height: '1em', position: 'relative', top: '2px' }}
            />
          </View>
          <FormattedMessage
            defaultMessage="Continue with Google"
            description="google login button"
          />
        </>
      )}
    </Button>
  );
}
