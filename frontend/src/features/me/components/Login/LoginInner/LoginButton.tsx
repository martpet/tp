import { Button, View } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import googleLogo from '~/assets/google-logo.svg';
import { useAppDispatch } from '~/common/hooks';
import { IdentityProvider } from '~/common/types';
import { loginWithProvider } from '~/features/me';

type Props = {
  provider: IdentityProvider;
  onClick?: () => void;
};

export function LoginButton({ provider, onClick }: Props) {
  const dispatch = useAppDispatch();
  const appleIcon = '';

  const handleClick = () => {
    dispatch(loginWithProvider(provider));
    if (onClick) onClick();
  };

  return (
    <Button
      variant="primary"
      onPress={handleClick}
      UNSAFE_style={{ paddingInline: '2em' }}
    >
      {provider === 'SignInWithApple' && (
        <>
          <View
            marginEnd="static-size-125"
            UNSAFE_style={{ fontSize: '1.4em', lineHeight: 1 }}
          >
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
