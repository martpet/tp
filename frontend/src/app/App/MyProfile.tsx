import { apiPaths, apiUrl } from '~/common/consts';
import { useAppDispatch, useAppSelector, useLoginPopup } from '~/common/hooks';
import { IdentityProviderName } from '~/common/types';
import { selectMe, signedOut } from '~/features/me';

export function MyProfile() {
  const me = useAppSelector(selectMe);

  return me ? (
    <>
      <strong>{me.givenName}</strong>
      <LogoutButton />
    </>
  ) : (
    <>
      <LoginButton provider="Google" />
      <LoginButton provider="SignInWithApple" />
    </>
  );
}

function LoginButton({ provider }: { provider: IdentityProviderName }) {
  const loginWithPopup = useLoginPopup();

  const handleClick = () => {
    loginWithPopup(provider);
  };

  return (
    <button type="button" onClick={handleClick}>
      {provider}
    </button>
  );
}

function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleClick = async () => {
    await dispatch(signedOut());
    window.location.href = apiUrl + apiPaths.logout;
  };

  return (
    <button type="button" onClick={handleClick}>
      Logout
    </button>
  );
}
