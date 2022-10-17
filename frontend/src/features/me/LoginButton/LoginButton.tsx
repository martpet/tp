import { Button, View } from '@adobe/react-spectrum';
import { FormattedMessage, useIntl } from 'react-intl';

import googleLogo from '~/assets/google-logo.svg';
import { IdentityProviderName } from '~/common/types';

import { useLoginPopup } from './useLoginPopup';

type Props = {
  provider: IdentityProviderName;
  onClick?: () => void;
};

export function LoginButton({ provider, onClick }: Props) {
  const loginWithPopup = useLoginPopup();
  const { formatMessage } = useIntl();
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
            defaultMessage="Sign in with Apple"
            description="apple sign in button"
          />
        </>
      )}

      {provider === 'Google' && (
        <>
          <View marginEnd="static-size-100">
            <img
              src={googleLogo}
              alt={formatMessage({
                defaultMessage: 'Google logo',
                description: 'google login button logo alt text',
              })}
              style={{ width: '1em', height: '1em', position: 'relative', top: '2px' }}
            />
          </View>
          <FormattedMessage
            defaultMessage="Sign in with Google"
            description="google sign in button"
          />
        </>
      )}
    </Button>
  );
}
